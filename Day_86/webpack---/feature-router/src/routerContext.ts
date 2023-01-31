import { withDependencies } from '@wix/thunderbolt-ioc'
import type { CandidateRouteInfo, IRouterContext } from './types'
import { getContextByRouteInfo } from './urlUtils'

export const RouterContext = withDependencies(
	[],
	(): IRouterContext => {
		return {
			getRouteInfoContext(routeInfo: CandidateRouteInfo) {
				return getContextByRouteInfo(routeInfo)
			},
		}
	}
)
