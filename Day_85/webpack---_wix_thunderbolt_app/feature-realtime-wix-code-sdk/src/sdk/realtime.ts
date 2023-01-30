import { v4 as uuid } from 'uuid'
import { Duplexer as DuplexerType } from '@wix/duplexer-js'
import {
	Channel,
	MessageHandler,
	Subscription,
	Error,
	MessageMetadata,
	PublisherMetadata,
	MessageData,
	UnsubscribeOptions,
	RealtimeAPI,
} from './domain'
import { CORVID_BACKEND_CODE_APP_DEF_ID, DUPLEXER } from './constants'
import { errors } from './errors'
import { validateCallback, validateSubscribe, validateUnsubscribe } from './validators'
import { Environment } from './environment'

export function realtime(
	duplexerSocketsServiceUrl: string,
	environment: Environment,
	onPageWillUnmount: (cb: () => void) => void
): RealtimeAPI {
	let connection: ReturnType<DuplexerType['connect']>
	const subscriptions: { [id: string]: Subscription } = {}
	let duplexer: DuplexerType
	const onConnectedCallbacks: Array<() => void> = []
	const onDisconnectedCallbacks: Array<() => void> = []
	const onErrorCallbacks: Array<(error: Error) => void> = []

	onPageWillUnmount(() => connection?.disconnect())

	async function createConnection() {
		if (connection) {
			return
		}

		const instanceUpdater = {
			getInstance: () => environment.getInstance(),
		}

		const { Duplexer } = await loadDuplexerModule()

		duplexer = new Duplexer(duplexerSocketsServiceUrl, {
			instanceUpdater,
			siteRevision: environment.getSiteRevision(),
			autoConnect: process.env.NODE_ENV === 'production',
		})

		connection = duplexer.connect({
			appDefId: CORVID_BACKEND_CODE_APP_DEF_ID,
		})

		environment.onLogin(() => duplexer.triggerInstanceChanged())

		connection.on(DUPLEXER.connected, () => {
			onConnectedCallbacks.forEach((cb) => cb())
		})

		connection.on(DUPLEXER.disconnected, () => {
			onDisconnectedCallbacks.forEach((cb) => cb())
		})

		connection.on(DUPLEXER.connectError, () => {
			onErrorCallbacks.forEach((cb) => cb(errors.CONNECTION_ERROR))
		})
	}

	async function subscribe(channel: Channel, handler: MessageHandler): Promise<string> {
		if (environment.isSSR()) {
			return Promise.resolve('')
		}

		const error = validateSubscribe(channel, handler)

		if (error) {
			return Promise.reject(error)
		}

		await createConnection()

		const prefixedChannel = maybePrefix(channel)

		const subscribedChannel = connection.subscribe(prefixedChannel.name, {
			resourceId: prefixedChannel.resourceId,
		})

		const subscriptionId = uuid()

		const onMessageCallback = ({ payload }: MessageData, { publisher }: MessageMetadata) => {
			handler(
				{
					payload,
					publisher: getPublisher(publisher),
				},
				channel
			)
		}

		subscribedChannel.on('message', onMessageCallback)

		return new Promise((resolve, reject) => {
			subscribedChannel.once(DUPLEXER.subscriptionSucceeded, () => {
				subscriptions[subscriptionId] = {
					name: channel.name,
					resourceId: channel.resourceId,
					channelEmitter: subscribedChannel,
					removeListener: () => subscribedChannel.off('message', onMessageCallback),
				}

				subscribedChannel.on(DUPLEXER.subscriptionFailed, () => {
					onErrorCallbacks.forEach((cb) => cb({ ...errors.RESUBSCRIBE_ERROR, channel }))
				})

				resolve(subscriptionId)
			})

			subscribedChannel.once(DUPLEXER.subscriptionFailed, () => {
				reject({ ...errors.SUBSCRIBE_FAIL, channel })
			})
		})
	}

	function unsubscribe({ channel, subscriptionId }: UnsubscribeOptions): Promise<void> {
		const error = validateUnsubscribe({
			channel,
			subscriptionId,
		})

		if (error) {
			return Promise.reject(error)
		}

		return new Promise((resolve, reject) => {
			try {
				if (subscriptionId) {
					if (subscriptions[subscriptionId]) {
						const { removeListener, name, resourceId } = subscriptions[subscriptionId]

						if (channel && (channel.name !== name || channel.resourceId !== resourceId)) {
							return reject(errors.CHANNEL_DOES_NOT_MATCH)
						}

						removeListener()

						resolve()
					} else {
						resolve()
					}
				} else {
					const { channelEmitter } =
						Object.values(subscriptions).find(
							(subscription) =>
								subscription.name === channel!.name && subscription.resourceId === channel!.resourceId
						) || {}

					if (!channelEmitter) {
						resolve()
						return
					}

					channelEmitter.once(DUPLEXER.unsubscribeSucceeded, resolve)

					const prefixedChannel = maybePrefix(channel!)

					connection.unsubscribe(prefixedChannel.name, prefixedChannel.resourceId)
				}
			} catch {
				resolve()
			}
		})
	}

	function onConnected(cb: () => void) {
		addCallback(cb, onConnectedCallbacks)
	}

	function onDisconnected(cb: () => void) {
		addCallback(cb, onDisconnectedCallbacks)
	}

	function onError(cb: (error: Error) => void) {
		addCallback(cb, onErrorCallbacks)
	}

	function loadDuplexerModule() {
		return import('@wix/duplexer-js' /* webpackChunkName: "realtimeWixCodeVendors" */)
	}

	function addCallback(cb: Function, cbList: Array<Function>) {
		const error = validateCallback(cb)
		if (error) {
			throw error
		}
		cbList.push(cb)
	}

	function maybePrefix(channel: Channel): Channel {
		if (environment.isPreview() && channel.name) {
			return {
				name: `@preview-${channel.name}`,
				resourceId: channel.resourceId,
			}
		}
		return channel
	}

	function getPublisher(publisher?: PublisherMetadata) {
		if (!publisher) {
			return
		}
		return { id: publisher.uid }
	}

	return {
		subscribe,
		unsubscribe,
		onConnected,
		onDisconnected,
		onError,
	}
}
