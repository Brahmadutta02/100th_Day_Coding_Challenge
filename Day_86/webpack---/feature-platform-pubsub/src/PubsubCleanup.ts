import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageWillUnmountHandler } from '@wix/thunderbolt-symbols'
import type { IPubsub } from './types'
import { PlatformPubsubSymbol } from './symbols'

export const PubsubCleanup = withDependencies(
	[PlatformPubsubSymbol],
	(pubsubFeature: IPubsub): IPageWillUnmountHandler => {
		return {
			pageWillUnmount() {
				pubsubFeature.clearListenersBesideStubs()
			},
		}
	}
)
