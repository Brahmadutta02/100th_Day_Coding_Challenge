import { withDependencies } from '@wix/thunderbolt-ioc'
import type { CandidateRouteInfo, IRoutingValidation } from './types'

export const RoutingValidation = withDependencies(
	[],
	(): IRoutingValidation => {
		return {
			isSamePageUrl(currentRouteUrl: string, nextUrl: string) {
				return currentRouteUrl === nextUrl
			},
			isTpaSamePageNavigation(currentRouteInfo: CandidateRouteInfo, nextRouteInfo: CandidateRouteInfo) {
				return (
					currentRouteInfo?.pageId === nextRouteInfo.pageId &&
					nextRouteInfo.type === 'Static' &&
					currentRouteInfo?.type !== 'Dynamic'
				)
			},
		}
	}
)
