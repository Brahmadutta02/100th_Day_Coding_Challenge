import { withDependencies } from '@wix/thunderbolt-ioc'
import { CurrentRouteInfoSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo } from 'feature-router'

export const GetCurrentPageIdHandler = withDependencies(
	[CurrentRouteInfoSymbol],
	(currentRouteInfo: ICurrentRouteInfo): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getCurrentPageId(): string {
					return currentRouteInfo.getCurrentRouteInfo()!.pageId
				},
			}
		},
	})
)
