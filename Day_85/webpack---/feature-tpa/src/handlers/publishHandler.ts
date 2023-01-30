import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { PlatformPubsubSymbol, IPubsub } from 'feature-platform-pubsub'

export type MessageData = {
	eventKey: string
	isPersistent: boolean
	eventData: any
}

export const PublishHandler = withDependencies(
	[PlatformPubsubSymbol],
	(pubsubFeature: IPubsub): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				publish(compId, msgData: MessageData, { appDefinitionId }) {
					pubsubFeature.publish(appDefinitionId, compId, msgData)
				},
			}
		},
	})
)
