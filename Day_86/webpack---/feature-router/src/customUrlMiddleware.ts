import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { CustomUrlMapperSymbol, ICustomUrlMapper } from 'feature-custom-url-mapper'
import type { ICustomUrlMiddleware, IRoutingConfig, CandidateRouteInfo } from './types'
import { name } from './symbols'

const customUrlMiddleware = (
	customUrlMapper: ICustomUrlMapper,
	routingConfig: IRoutingConfig
): ICustomUrlMiddleware => {
	const resolveCustomUrl = (routeInfo: CandidateRouteInfo) => {
		const { routes } = routingConfig
		const customRoute = customUrlMapper?.getUrlPageRoute(routes, routeInfo.relativeUrl)
		return customRoute ? { ...routeInfo, ...routes[customRoute] } : null
	}
	return {
		handleSync: (routeInfo: CandidateRouteInfo) => {
			const { routes, isWixSite } = routingConfig

			// If the routeInfo has a type it means that this is a familiar Static or Dynamic route.
			if (routeInfo.type) {
				return routeInfo
			}

			const customRoute = resolveCustomUrl(routeInfo)
			if (customRoute) {
				return customRoute
			}

			const defaultRoute = './'
			const isPageLink = ['https:', 'http:'].includes(routeInfo.parsedUrl.protocol)

			return isWixSite && isPageLink ? { ...routeInfo, ...routes[defaultRoute] } : routeInfo
		},
		resolveCustomUrl,
	}
}

export const CustomUrlMiddleware = withDependencies(
	[optional(CustomUrlMapperSymbol), named(SiteFeatureConfigSymbol, name)],
	customUrlMiddleware
)
