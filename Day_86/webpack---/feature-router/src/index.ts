import {
	RoutingMiddleware,
	Router as RouterSymbol,
	UrlHistoryManagerSymbol,
	UrlChangeHandlerForPage,
	PopHistoryStateHandler,
	RoutingLinkUtilsAPISymbol,
	CustomUrlMiddlewareSymbol,
	PageJsonFileNameMiddlewareSymbol,
	CustomNotFoundPageMiddlewareSymbol,
	ShouldNavigateHandlerSymbol,
	CommonNavigationClickHandlerSymbol,
	RouterContextSymbol,
	RoutingValidationSymbol,
	PageNumberSymbol,
	CustomPageContextSymbol,
	queryParamsWhitelistSymbol,
} from './symbols'
import {
	LifeCycle,
	CurrentRouteInfoSymbol,
	NavigationClickHandlerSymbol,
	SamePageUrlChangeListenerSymbol,
	SiteLinkClickHandlerSymbol,
	PagesMapSymbol,
} from '@wix/thunderbolt-symbols'
import { Router } from './router'
import { RouterInitAppWillMount, RouterInitOnPopState } from './routerInit'
import { resolveUrl, keepInternalQueryParamsOnly } from './resolveUrl'
import {
	removeQueryParams,
	replaceProtocol,
	getRelativeUrl,
	removeProtocol,
	removeUrlHash,
	getUrlHash,
} from './urlUtils'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { NavigationClickHandler } from './navigationClickHandler'
import { CommonNavigationClickHandler } from './commonNavigationClickHandler'
import { CurrentRouteInfo } from './currentRouteInfo'
import { RoutingLinkUtilsAPI } from './routingLinkUtilsAPI'
import { UrlHistoryManager, PopStateListener, UrlChangeListener } from './urlManager'
import { ReportBiClickHandler } from './reportBiClickHandler'
import type {
	IUrlHistoryManager,
	IUrlChangeHandler,
	IRouter,
	IRoutingConfig,
	RouteInfo,
	IRoutingMiddleware,
	ICurrentRouteInfo,
	IRoutingLinkUtilsAPI,
	DynamicPagesAPI,
	FetchParams,
	CandidateRouteInfo,
	IShouldNavigateHandler,
	IPageNumber,
	IPagesMap,
	ICustomPageContext,
} from './types'
import { CustomUrlMiddleware } from './customUrlMiddleware'
import { PageJsonFileNameMiddleware } from './pageJsonFileNameMiddleware'
import { CustomNotFoundPageMiddleware } from './customNotFoundPageMiddleware'
import { RoutingValidation } from './routingValidation'
import { RouterContext } from './routerContext'
import { PageNumberHandler } from './pageNumber'
import { PagesMap } from './pagesMap'
import { queryParamsWhitelistHandler } from './queryParamWhitelistHandler'

// Public loader
export const site: ContainerModuleLoader = (bind) => {
	bind(RouterSymbol).to(Router)
	bind(CustomUrlMiddlewareSymbol).to(CustomUrlMiddleware)
	bind(PageJsonFileNameMiddlewareSymbol).to(PageJsonFileNameMiddleware)
	bind(CustomNotFoundPageMiddlewareSymbol).to(CustomNotFoundPageMiddleware)
	bind(LifeCycle.AppWillMountHandler).to(RouterInitAppWillMount)
	bind(PopHistoryStateHandler).to(RouterInitOnPopState)
	bind(RoutingLinkUtilsAPISymbol).to(RoutingLinkUtilsAPI)
	bind(NavigationClickHandlerSymbol).to(NavigationClickHandler)
	bind(CommonNavigationClickHandlerSymbol).to(CommonNavigationClickHandler)
	bind(CurrentRouteInfoSymbol).to(CurrentRouteInfo)
	bind(LifeCycle.AppWillMountHandler).to(PopStateListener)
	bind(SamePageUrlChangeListenerSymbol).to(UrlChangeListener)
	bind(UrlHistoryManagerSymbol, LifeCycle.AppWillLoadPageHandler).to(UrlHistoryManager)
	bind(RouterContextSymbol).to(RouterContext)
	bind(RoutingValidationSymbol).to(RoutingValidation)
	bind(SiteLinkClickHandlerSymbol).to(ReportBiClickHandler)
	bind(PageNumberSymbol, LifeCycle.AppWillLoadPageHandler).to(PageNumberHandler)
	bind(PagesMapSymbol).to(PagesMap)
	bind(queryParamsWhitelistSymbol).to(queryParamsWhitelistHandler)
}

// Public Symbols
export {
	RouterSymbol as Router,
	RoutingMiddleware,
	NavigationClickHandlerSymbol,
	UrlChangeHandlerForPage,
	UrlHistoryManagerSymbol,
	PopHistoryStateHandler,
	RoutingLinkUtilsAPISymbol,
	ShouldNavigateHandlerSymbol,
	PageNumberSymbol,
	CustomPageContextSymbol,
}

// Public Types
export {
	IRouter,
	IRoutingConfig,
	IRoutingMiddleware,
	RouteInfo,
	CandidateRouteInfo,
	ICurrentRouteInfo,
	IUrlHistoryManager,
	IUrlChangeHandler,
	IRoutingLinkUtilsAPI,
	DynamicPagesAPI,
	FetchParams,
	IShouldNavigateHandler,
	IPageNumber,
	IPagesMap,
	ICustomPageContext,
}

// Public Utils
export {
	resolveUrl,
	keepInternalQueryParamsOnly,
	removeQueryParams,
	replaceProtocol,
	getRelativeUrl,
	removeProtocol,
	removeUrlHash,
	getUrlHash,
}
