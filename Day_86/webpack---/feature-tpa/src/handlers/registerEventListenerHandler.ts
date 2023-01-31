import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaEventsListenerManagerSymbol } from '../symbols'
import { ITPAEventsListenerManager } from '../types'
import { PlatformPubsubSymbol, IPubsub, TPA_PUB_SUB_PREFIX } from 'feature-platform-pubsub'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { EventName } from '../eventsListenerManager'

export type MessageData = {
	eventKey: string
	receivePastEvents?: boolean
}

export const RegisterEventListenerHandler = withDependencies(
	[TpaEventsListenerManagerSymbol, PlatformPubsubSymbol],
	(eventRegistry: ITPAEventsListenerManager, pubsubFeature: IPubsub): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				registerEventListener(
					compId,
					{ eventKey, receivePastEvents = false }: MessageData,
					{ callId, tpa, tpaCompData: { widgetId = '' } = {}, appDefinitionId }
				) {
					if (eventKey.startsWith(TPA_PUB_SUB_PREFIX)) {
						pubsubFeature.handleIframeSubscribe(appDefinitionId, compId, {
							eventKey,
							isPersistent: receivePastEvents,
							callId,
						})
					} else {
						const listener = (eventType: EventName, payload: any) => {
							tpa.postMessage(
								JSON.stringify({
									intent: 'addEventListener',
									eventType,
									params: payload,
								}),
								'*'
							)
						}
						eventRegistry.register(eventKey, compId, listener, {
							widgetId,
							appDefinitionId,
						})
					}
				},
			}
		},
	})
)
