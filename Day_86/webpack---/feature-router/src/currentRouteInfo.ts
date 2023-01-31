import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { DynamicRouteData, SiteFeatureConfigSymbol, FeatureExportsSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { getRelativeUrl } from './urlUtils'
import type { ICurrentRouteInfo, IRoutingConfig, CandidateRouteInfo } from './types'
import { name } from './symbols'

const currentRouteInfo = (
	routingConfig: IRoutingConfig,
	routerExports: IFeatureExportsStore<typeof name>
): ICurrentRouteInfo => {
	let routeInfo: CandidateRouteInfo
	let prevRouteInfo: CandidateRouteInfo | null = null
	let wantedRouteInfo: Partial<CandidateRouteInfo> | null = null

	return {
		getCurrentRouteInfo: () => {
			return routeInfo ? routeInfo : null
		},
		getPreviousRouterInfo: () => {
			return prevRouteInfo
		},
		getWantedRouteInfo: () => {
			return wantedRouteInfo
		},
		updateCurrentRouteInfo: (nextRouteInfo: CandidateRouteInfo) => {
			prevRouteInfo = routeInfo
			routeInfo = nextRouteInfo
			wantedRouteInfo = null

			routerExports.export({ pageId: nextRouteInfo.pageId })
		},
		updateWantedRouteInfo: (candidateRouteInfo: Partial<CandidateRouteInfo>) => {
			wantedRouteInfo = candidateRouteInfo
		},
		updateRouteInfoUrl: (parsedUrl: URL) => {
			if (routeInfo) {
				routeInfo.parsedUrl = parsedUrl
				routeInfo.relativeUrl = getRelativeUrl(parsedUrl.href, routingConfig.baseUrl)
			}
		},
		updateCurrentDynamicRouteInfo: (dynamicRouteData: DynamicRouteData) => {
			routeInfo = { ...routeInfo, dynamicRouteData }
		},
		isLandingOnProtectedPage: () => !routeInfo,
		getCurrentUrlWithoutQueryParams: () => {
			if (!routeInfo) {
				return null
			}

			return `${routeInfo.parsedUrl.origin}${routeInfo.parsedUrl.pathname}`
		},
	}
}

export const CurrentRouteInfo = withDependencies(
	[named(SiteFeatureConfigSymbol, name), named(FeatureExportsSymbol, name)],
	currentRouteInfo
)
