import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { IPubsub } from '../types'
import { PlatformPubsubSymbol } from '../symbols'

export const pubsubSdkHandlers = withDependencies(
	[PlatformPubsubSymbol],
	(pubsubFeature: IPubsub): SdkHandlersProvider<any> => {
		return {
			getSdkHandlers: () => ({
				publish(appDefinitionId: string, eventKey: string, eventData: any, isPersistent: boolean) {
					if (!process.env.browser) {
						return
					}
					pubsubFeature.publish(appDefinitionId, 'worker', { eventKey, isPersistent, eventData })
				},
				subscribe(
					appDefinitionId: string,
					eventKey: string,
					callback: (eventData: any) => void,
					isPersistent: boolean
				) {
					if (!process.env.browser) {
						return
					}
					pubsubFeature.subscribe(appDefinitionId, 'worker', { eventKey, isPersistent }, callback)
				},
				unsubscribe(appDefinitionId: string, eventKey: string) {
					if (!process.env.browser) {
						return
					}
					pubsubFeature.unsubscribe(appDefinitionId, 'worker', eventKey)
				},
			}),
		}
	}
)
