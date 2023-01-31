import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import type { IRoutingConfig, IRoutingMiddleware } from './types'
import { name } from './symbols'
import { errorPagesIds } from '@wix/thunderbolt-commons'

const customNotFoundPageMiddleware = (routingConfig: IRoutingConfig): IRoutingMiddleware => ({
	handle: async (routeInfo) => {
		if (
			(!routeInfo.pageId || routeInfo.pageId === errorPagesIds._404_dp) &&
			routingConfig.customNotFoundPage?.pageId
		) {
			return {
				...routeInfo,
				pageId: routingConfig.customNotFoundPage?.pageId,
				relativeUrl: routingConfig.customNotFoundPage?.pageRoute,
			}
		}
		return routeInfo
	},
})

export const CustomNotFoundPageMiddleware = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	customNotFoundPageMiddleware
)
