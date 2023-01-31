import { withDependencies } from '@wix/thunderbolt-ioc'
import { ITPAEventsListenerManager } from '../types'
import { PlatformPubsubSymbol, IPubsub, TPA_PUB_SUB_PREFIX } from 'feature-platform-pubsub'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { TpaEventsListenerManagerSymbol } from '../symbols'

export type MessageData = {
	eventKey: string
}

export const RemoveEventListenerHandler = withDependencies(
	[PlatformPubsubSymbol, TpaEventsListenerManagerSymbol],
	(pubsubFeature: IPubsub, eventRegistry: ITPAEventsListenerManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				removeEventListener(compId, { eventKey }: MessageData, { appDefinitionId }) {
					if (eventKey.startsWith(TPA_PUB_SUB_PREFIX)) {
						pubsubFeature.unsubscribe(appDefinitionId, compId, eventKey)
					} else {
						eventRegistry.unregister(eventKey, compId)
					}
				},
			}
		},
	})
)
