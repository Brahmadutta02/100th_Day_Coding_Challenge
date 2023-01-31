import { multi, named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	IAppWillRenderFirstPageHandler,
	IPageWillUnmountHandler,
	IStructureAPI,
	LifeCycle,
	SiteFeatureConfigSymbol,
	StructureAPI,
	BISymbol,
	BIReporter,
	LoggerSymbol,
	ILogger,
	MasterPageFeatureConfigSymbol,
	InternalNavigationType,
	BrowserWindowSymbol,
	BrowserWindow,
	NavigationParams,
	LOADING_PHASES,
} from '@wix/thunderbolt-symbols'
import { resolveUrl } from './resolveUrl'
import {
	name,
	RoutingMiddleware,
	UrlHistoryManagerSymbol,
	CustomUrlMiddlewareSymbol,
	PageJsonFileNameMiddlewareSymbol,
	CustomNotFoundPageMiddlewareSymbol,
	RouterContextSymbol,
	RoutingValidationSymbol,
	PageNumberSymbol,
	queryParamsWhitelistSymbol,
} from './symbols'
import type {
	ICurrentRouteInfo,
	ICustomUrlMiddleware,
	IRoutingMiddleware,
	IRouter,
	IRoutingConfig,
	RouteInfo,
	IUrlHistoryManager,
	RouterMasterPageConfig,
	CandidateRouteInfo,
	IRouterContext,
	IRoutingValidation,
	IPageNumber,
} from './types'
import { IPageProvider, PageProviderSymbol, IPageInitializer, PageInitializerSymbol } from 'feature-pages'
import { errorPagesIds, isSSR, taskify } from '@wix/thunderbolt-commons'
import { reportNavigationEnd, reportNavigationStart } from './navigationMonitoring'
import { NavigationManagerSymbol, INavigationManager } from 'feature-navigation-manager'
import { removeUrlHash, removeQueryParams, removeTrailingSlashAndQueryParams } from './urlUtils'
import { IQueryParamsWhitelistHandler } from './types'

const emptyMiddleware: IRoutingMiddleware = {
	handle: async (routeInfo) => routeInfo,
}
const emptyCustomUrlMiddleware: ICustomUrlMiddleware = {
	handleSync: (routeInfo) => routeInfo,
	resolveCustomUrl: (routeInfo) => routeInfo,
}

const notifyPageWillUnmount = async (routeInfo: RouteInfo, pageProvider: IPageProvider) => {
	const { contextId, pageId } = routeInfo
	const pageReflector = await pageProvider(contextId, pageId)
	const handlers = pageReflector.getAllImplementersOf<IPageWillUnmountHandler>(LifeCycle.PageWillUnmountHandler)
	await Promise.all(handlers.map((handler) => handler.pageWillUnmount({ pageId, contextId })))
}

const routerFactory = (
	routingConfig: IRoutingConfig,
	routingMasterPageConfig: RouterMasterPageConfig,
	structureApi: IStructureAPI,
	pageProvider: IPageProvider,
	routerContext: IRouterContext,
	routingValidation: IRoutingValidation,
	navigationManager: INavigationManager,
	pageJsonFileNameMiddleware: IRoutingMiddleware = emptyMiddleware,
	customNotFoundPageMiddleware: IRoutingMiddleware = emptyMiddleware,
	customUrlMiddleware: ICustomUrlMiddleware = emptyCustomUrlMiddleware,
	dynamicRoutingMiddleware: IRoutingMiddleware = emptyMiddleware,
	protectedRoutingMiddleware: IRoutingMiddleware = emptyMiddleware,
	BlockingDialogsRoutingMiddleware: IRoutingMiddleware = emptyMiddleware,
	pageNumberHandler: IPageNumber,
	{ initPage }: IPageInitializer,
	appWillRenderFirstPageHandlers: Array<IAppWillRenderFirstPageHandler>,
	currentRouteInfo: ICurrentRouteInfo,
	urlHistoryManager: IUrlHistoryManager,
	biReporter: BIReporter,
	logger: ILogger,
	window: BrowserWindow,
	queryParamHandler: IQueryParamsWhitelistHandler
): IRouter => {
	const convertToFullUrl = (url: string, removeSearchParamsAndHash: boolean) => {
		const isHomePageUrl = url === routingConfig.baseUrl || url === './'
		const candidateUrl = isHomePageUrl ? routingConfig.baseUrl : url
		const fullUrl = new URL(candidateUrl, `${routingConfig.baseUrl}/`)

		if (removeSearchParamsAndHash) {
			const urlWithoutHash = removeUrlHash(fullUrl.href)
			return removeQueryParams(urlWithoutHash)
		}
		return fullUrl.href
	}

	const buildRouteInfo = (url: string): Partial<CandidateRouteInfo> => {
		const fullURL = convertToFullUrl(url, false)
		const parserUrl = urlHistoryManager.getParsedUrl()
		const queryParams = queryParamHandler.getWhitelist(parserUrl)
		return resolveUrl(fullURL, routingConfig, { currentParsedUrl: parserUrl, queryParamsWhitelist: queryParams })
	}

	const handleStaticRoute = async (routeInfo: CandidateRouteInfo, navigationParams?: NavigationParams) => {
		currentRouteInfo.updateCurrentRouteInfo(routeInfo)
		urlHistoryManager.pushUrlState(routeInfo.parsedUrl, navigationParams)

		const { contextId, pageId } = routeInfo
		await initPage({ pageId, contextId })

		if (navigationManager.isFirstNavigation()) {
			const shouldReportAdditionalLoadingPhases = process.env.PACKAGE_NAME === 'thunderbolt-ds'
			if (shouldReportAdditionalLoadingPhases) {
				logger.phaseStarted(LOADING_PHASES.APP_WILL_RENDER_FIRST_PAGE)
			}
			await Promise.all(
				appWillRenderFirstPageHandlers.map((handler) =>
					taskify(() => handler.appWillRenderFirstPage({ pageId, contextId }))
				)
			)
			if (shouldReportAdditionalLoadingPhases) {
				logger.phaseEnded(LOADING_PHASES.APP_WILL_RENDER_FIRST_PAGE)
			}
		}
		navigationManager.setShouldBlockRender(false)
		structureApi.addPageAndRootToRenderedTree(pageId, contextId)
		return routeInfo
	}

	const scrollToTop = () => {
		if (!isSSR(window)) {
			window!.scrollTo({ top: 0 })
			const targetElement = window!.document.getElementById('SCROLL_TO_TOP')
			// eslint-disable-next-line no-unused-expressions
			targetElement?.focus()
		}
	}

	const handleSamePageNavigation = (
		currentRoute: RouteInfo | null,
		finalRouteInfo: CandidateRouteInfo,
		navigationParams?: NavigationParams
	) => {
		currentRouteInfo.updateCurrentRouteInfo(finalRouteInfo)
		urlHistoryManager.pushUrlState(finalRouteInfo.parsedUrl, navigationParams)

		const shouldScrollToTop = !navigationParams?.disableScrollToTop
		if (shouldScrollToTop) {
			scrollToTop()
		}
		reportNavigationEnd(
			currentRoute,
			finalRouteInfo,
			InternalNavigationType.INNER_ROUTE,
			biReporter,
			logger,
			pageNumberHandler.getPageNumber()
		)
	}

	let redirectCounter = 0

	const navigate = async (url: string, navigationParams?: NavigationParams): Promise<boolean> => {
		const fullUrlRouteWithoutQueryParams = convertToFullUrl(url, true)
		const currentRoute = currentRouteInfo.getCurrentRouteInfo() as CandidateRouteInfo
		const currentRouteUrlWithoutQueryParams = currentRoute && convertToFullUrl(currentRoute.parsedUrl.href, true)
		if (routingValidation.isSamePageUrl(currentRouteUrlWithoutQueryParams, fullUrlRouteWithoutQueryParams)) {
			currentRouteInfo.updateCurrentRouteInfo({ ...currentRoute, anchorDataId: navigationParams?.anchorDataId })
			const fullUrlRouteWithQueryParams = new URL(convertToFullUrl(url, false))
			urlHistoryManager.pushUrlState(fullUrlRouteWithQueryParams)
			if (!fullUrlRouteWithQueryParams.hash && !navigationParams?.disableScrollToTop) {
				scrollToTop()
			}
			return false
		}

		let routeInfo: Partial<CandidateRouteInfo> | null = buildRouteInfo(url)

		reportNavigationStart(currentRoute, routeInfo, biReporter, logger, pageNumberHandler.getPageNumber())
		currentRouteInfo.updateWantedRouteInfo(routeInfo)

		routeInfo = customUrlMiddleware.handleSync(routeInfo)

		navigationManager.startDataFetching()
		routeInfo = routeInfo && (await dynamicRoutingMiddleware.handle(routeInfo))
		navigationManager.endDataFetching()

		if (routeInfo && routeInfo.redirectUrl) {
			if (redirectCounter < 4) {
				redirectCounter++
				reportNavigationEnd(
					currentRoute,
					routeInfo,
					InternalNavigationType.DYNAMIC_REDIRECT,
					biReporter,
					logger,
					pageNumberHandler.getPageNumber()
				)
				return navigate(routeInfo.redirectUrl)
			}
			redirectCounter = 0
			reportNavigationEnd(
				currentRoute,
				routeInfo,
				InternalNavigationType.DYNAMIC_REDIRECT,
				biReporter,
				logger,
				pageNumberHandler.getPageNumber()
			)
			return false
		} else {
			redirectCounter = 0
		}

		routeInfo = routeInfo && (await customNotFoundPageMiddleware.handle(routeInfo))
		routeInfo = routeInfo && (await pageJsonFileNameMiddleware.handle(routeInfo))
		routeInfo = routeInfo && (await BlockingDialogsRoutingMiddleware.handle(routeInfo))
		routeInfo = routeInfo && (await protectedRoutingMiddleware.handle(routeInfo))

		if (!routeInfo) {
			reportNavigationEnd(
				currentRoute,
				routeInfo,
				InternalNavigationType.NAVIGATION_ERROR,
				biReporter,
				logger,
				pageNumberHandler.getPageNumber()
			)
			return false
		}

		if (!routeInfo.pageJsonFileName && protectedRoutingMiddleware !== emptyMiddleware) {
			reportNavigationEnd(
				currentRoute,
				routeInfo,
				InternalNavigationType.NAVIGATION_ERROR,
				biReporter,
				logger,
				pageNumberHandler.getPageNumber()
			)
			throw new Error(`did not find the json file name for pageId ${routeInfo.pageId}`)
		}

		if (navigationParams?.anchorDataId) {
			routeInfo.anchorDataId = navigationParams?.anchorDataId
		}

		if (routingMasterPageConfig.popupPages[routeInfo.pageId!]) {
			routeInfo = { ...routeInfo, pageId: errorPagesIds._404_dp }
		}

		routeInfo.contextId = routerContext.getRouteInfoContext(routeInfo as CandidateRouteInfo)

		const finalRouteInfo = routeInfo as CandidateRouteInfo

		if (routingValidation.isTpaSamePageNavigation(currentRoute, finalRouteInfo)) {
			handleSamePageNavigation(currentRoute, finalRouteInfo, navigationParams)
			return false
		}

		if (navigationManager.isDuringNavigation()) {
			const shouldContinue = await navigationManager.waitForShouldContinueNavigation()
			const currentRouteFullUrl = convertToFullUrl(
				(currentRouteInfo.getCurrentRouteInfo() as CandidateRouteInfo).parsedUrl.href,
				true
			)
			if (!shouldContinue || fullUrlRouteWithoutQueryParams === currentRouteFullUrl) {
				reportNavigationEnd(
					currentRoute,
					finalRouteInfo,
					InternalNavigationType.CANCELED,
					biReporter,
					logger,
					pageNumberHandler.getPageNumber()
				)
				return false
			}
		}

		navigationManager.startNavigation()
		navigationManager.setShouldBlockRender(true)

		if (currentRoute) {
			await notifyPageWillUnmount(currentRoute, pageProvider)
		}
		await handleStaticRoute(finalRouteInfo, navigationParams)
		reportNavigationEnd(
			currentRoute,
			finalRouteInfo,
			InternalNavigationType.NAVIGATION,
			biReporter,
			logger,
			pageNumberHandler.getPageNumber()
		)
		return true
	}

	const isInternalValidRoute = (url: string): boolean => {
		const routeInfo = resolveUrl(url, routingConfig)
		const customRoute = customUrlMiddleware.resolveCustomUrl(routeInfo)
		const { type, relativeUrl = '', pageId } = customRoute || routeInfo
		const isHomePage = routingConfig.mainPageId === pageId
		const relativeUrlToCheck = isHomePage ? relativeUrl : removeTrailingSlashAndQueryParams(relativeUrl)
		const relativeUrlDepth = relativeUrlToCheck.split('/').length
		switch (type) {
			case 'Dynamic':
				return true
			case 'Static':
				// Static page with inner route is supported only in tpa pages and wixapps app-builder AppPages
				return !!(
					relativeUrlDepth === 2 ||
					routingMasterPageConfig.tpaSectionPageIds[pageId!] ||
					routingMasterPageConfig.appBuilderAppPageIds[pageId!]
				)
			default:
				return false
		}
	}

	return {
		navigate,
		isInternalValidRoute,
		buildRouteInfo,
	}
}

export const Router = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		StructureAPI,
		PageProviderSymbol,
		RouterContextSymbol,
		RoutingValidationSymbol,
		NavigationManagerSymbol,
		optional(PageJsonFileNameMiddlewareSymbol),
		optional(CustomNotFoundPageMiddlewareSymbol),
		optional(CustomUrlMiddlewareSymbol),
		optional(RoutingMiddleware.Dynamic),
		optional(RoutingMiddleware.Protected),
		optional(RoutingMiddleware.BlockingDialogs),
		PageNumberSymbol,
		PageInitializerSymbol,
		multi(LifeCycle.AppWillRenderFirstPageHandler),
		CurrentRouteInfoSymbol,
		UrlHistoryManagerSymbol,
		BISymbol,
		LoggerSymbol,
		BrowserWindowSymbol,
		queryParamsWhitelistSymbol,
	],
	routerFactory
)
