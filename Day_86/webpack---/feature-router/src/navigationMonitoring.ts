import type { RouteInfo } from './types'
import { BIReporter, ILogger, InternalNavigationType, NavigationLoggerStringMap } from '@wix/thunderbolt-symbols'

export const reportNavigationStart = (
	currentNavInfo: RouteInfo | null,
	routeInfo: Partial<RouteInfo> | null,
	biReporter: BIReporter,
	logger: ILogger,
	pageNumber: number
) => {
	if (currentNavInfo) {
		// will be `undefined` in first render / load, we don't want to report it
		biReporter.reportPageNavigation(routeInfo?.pageId)
		logger.interactionStarted('page-navigation', {
			paramsOverrides: { pageId: `${routeInfo?.pageId}`, pn: `${pageNumber}` },
		})
	}
}

export const reportNavigationEnd = (
	currentNavInfo: RouteInfo | null,
	routeInfo: Partial<RouteInfo> | null,
	navigationType: InternalNavigationType,
	biReporter: BIReporter,
	logger: ILogger,
	pageNumber: number
) => {
	if (currentNavInfo) {
		// will be `undefined` in first render / load, we don't want to report it
		biReporter.reportPageNavigationDone(routeInfo?.pageId, navigationType)
		logger.setGlobalsForErrors({ tags: { pageId: routeInfo?.pageId } })
		logger.interactionEnded(NavigationLoggerStringMap[navigationType], {
			paramsOverrides: { pageId: `${routeInfo?.pageId}`, pn: `${pageNumber}` },
		})
	}
}
