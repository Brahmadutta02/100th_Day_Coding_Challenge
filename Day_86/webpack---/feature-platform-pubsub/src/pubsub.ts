import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IPubsub } from './types'
import { BrowserWindowSymbol, BrowserWindow, contextIdSymbol } from '@wix/thunderbolt-symbols'

const hub: {
	[appDefId: string]: {
		[eventName: string]: {
			persistentData: Array<{ name: string; data: any }>
			listeners: {
				[contextId: string]: { [compId: string]: Array<Function> }
			}
		}
	}
} = {}
export const TPA_PUB_SUB_PREFIX = 'TPA_PUB_SUB_'

export function stripPubSubPrefix(str: string) {
	const prefixRegex = new RegExp(`^${TPA_PUB_SUB_PREFIX}`)
	return str.replace(prefixRegex, '')
}

function sendToIframe(compId: string, dataToPublish: any, window: BrowserWindow) {
	const comp = window!.document.getElementById(compId)
	if (!comp) {
		return
	}
	const iframe = comp.getElementsByTagName('iframe')[0]
	if (iframe && iframe.contentWindow) {
		iframe.contentWindow.postMessage(JSON.stringify(dataToPublish), '*')
	}
}

const pubsubFactory = (window: BrowserWindow, contextId: string): IPubsub => {
	function getEvent(appDefId: string, eventName: string) {
		const empty = {
			persistentData: [],
			listeners: {},
		}
		if (!hub[appDefId]) {
			hub[appDefId] = {
				[eventName]: empty,
			}
		} else if (!hub[appDefId][eventName]) {
			hub[appDefId][eventName] = empty
		}
		return hub[appDefId][eventName]
	}

	function deleteListeners(condition: (id: string, contextId: string) => boolean) {
		Object.keys(hub).forEach((appId) => {
			Object.keys(hub[appId]).forEach((eventName) => {
				const event = getEvent(appId, eventName)
				Object.entries(event.listeners).forEach(([ctxId, listeners]) => {
					Object.keys(listeners).forEach((compId) => {
						if (condition(compId, ctxId)) {
							delete event.listeners[ctxId][compId]
						}
					})
				})
			})
		})
	}

	return {
		publish(
			appDefId: string,
			compId: string,
			msgData: { eventKey: string; isPersistent: boolean; eventData: any }
		) {
			const eventKeyStripped = stripPubSubPrefix(msgData.eventKey)
			const isPersistent = msgData.isPersistent
			const event = getEvent(appDefId, eventKeyStripped)
			const eventListeners = event.listeners
			Object.entries(eventListeners).forEach(([ctxId, components]) =>
				Object.keys(components).forEach((targetCompId) => {
					eventListeners[ctxId][targetCompId].forEach((listener) =>
						listener({ data: msgData.eventData, name: eventKeyStripped, origin: compId })
					)
				})
			)

			if (isPersistent) {
				const dataToPersist = msgData.eventData
				event.persistentData.push({ name: eventKeyStripped, data: dataToPersist })
			}
		},
		subscribe(
			appDefId: string,
			compId: string,
			msgData: { eventKey: string; isPersistent: boolean },
			callback: Function
		) {
			const eventName = stripPubSubPrefix(msgData.eventKey)
			const event = getEvent(appDefId, eventName)
			if (!event.listeners[contextId]) {
				event.listeners[contextId] = {}
			}
			if (!event.listeners[contextId][compId]) {
				event.listeners[contextId][compId] = [callback]
			} else if (compId === 'worker') {
				event.listeners[contextId][compId].push(callback)
			}

			if (msgData.isPersistent) {
				if (event.persistentData.length) {
					callback({ data: event.persistentData[0].data, name: eventName, origin: compId }, true)
				}
			}
		},
		unsubscribe(appDefId: string, compId: string, eventKey: string) {
			const event = getEvent(appDefId, stripPubSubPrefix(eventKey))
			Object.keys(event.listeners).forEach((ctxId) => {
				delete event.listeners[ctxId][compId]
			})
		},
		handleIframeSubscribe(appDefinitionId: string, compId: string, { eventKey, isPersistent, callId }) {
			this.subscribe(
				appDefinitionId,
				compId,
				{
					eventKey,
					isPersistent,
				},
				(eventData: any, isTriggeredImmediately: boolean = false) => {
					const dataToPublish = isTriggeredImmediately
						? {
								intent: 'TPA_RESPONSE',
								callId,
								type: 'registerEventListener',
								res: {
									drain: true,
									data: [eventData],
								},
								status: true,
								compId,
						  }
						: {
								eventType: eventKey,
								intent: 'addEventListener',
								params: eventData,
						  }
					sendToIframe(compId, dataToPublish, window)
				}
			)
		},
		clearListenersBesideStubs() {
			deleteListeners(
				(compId: string, listenerContextId: string) =>
					!compId.includes('tpapopup') &&
					!compId.includes('tpaWorker') &&
					listenerContextId === contextId &&
					listenerContextId !== 'masterPage'
			)
		},
		clearListenersByCompId(id: string) {
			deleteListeners((compId: string) => compId === id)
		},
	}
}

export const Pubsub = withDependencies([BrowserWindowSymbol, contextIdSymbol], pubsubFactory)
