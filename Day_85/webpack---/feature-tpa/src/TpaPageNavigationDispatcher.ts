import { withDependencies } from '@wix/thunderbolt-ioc'
import { CurrentRouteInfoSymbol, IAppDidLoadPageHandler } from '@wix/thunderbolt-symbols'
import type { ITPAEventsListenerManager } from './types'
import { TpaEventsListenerManagerSymbol } from './symbols'
import { ICurrentRouteInfo } from 'feature-router'

export const TpaPageNavigationDispatcher = withDependencies(
	[TpaEventsListenerManagerSymbol, CurrentRouteInfoSymbol],
	(
		tpaEventsListenerManager: ITPAEventsListenerManager,
		currentRouteInfo: ICurrentRouteInfo
	): IAppDidLoadPageHandler => {
		return {
			appDidLoadPage({ pageId }) {
				const prevPageId = currentRouteInfo.getPreviousRouterInfo()?.pageId
				if (!prevPageId || prevPageId === pageId) {
					return
				}
				const params: any = {
					fromPage: prevPageId,
					toPage: pageId,
				}
				const routerPublicData = currentRouteInfo.getCurrentRouteInfo()!.dynamicRouteData?.publicData
				if (routerPublicData) {
					params.routerPublicData = routerPublicData
				}
				tpaEventsListenerManager.dispatch('PAGE_NAVIGATION', () => params)
			},
		}
	}
)
