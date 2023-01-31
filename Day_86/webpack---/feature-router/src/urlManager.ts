import { withDependencies, multi, named } from '@wix/thunderbolt-ioc'
import { name, PopHistoryStateHandler, UrlChangeHandlerForPage } from './symbols'
import {
	IAppWillMountHandler,
	CurrentRouteInfoSymbol,
	BrowserWindowSymbol,
	BrowserWindow,
	ViewerModelSym,
	ViewerModel,
	SamePageUrlChangeListenerSymbol,
	ISamePageUrlChangeListener,
	IAppWillLoadPageHandler,
	MasterPageFeatureConfigSymbol,
	ILogger,
	LoggerSymbol,
	NavigationParams,
	FeatureExportsSymbol,
	ModifyUrlChangeListeners,
} from '@wix/thunderbolt-symbols'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import type {
	IUrlHistoryPopStateHandler,
	IUrlHistoryManager,
	IUrlChangeHandler,
	ICurrentRouteInfo,
	IUrlHistoryState,
	RouterMasterPageConfig,
} from './types'
import { getRelativeUrl, getRelativeEncodedUrl } from './urlUtils'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'

export const UrlChangeListener = withDependencies(
	[PageProviderSymbol, CurrentRouteInfoSymbol],
	(pageProvider: IPageProvider, currentRouteInfo: ICurrentRouteInfo): ISamePageUrlChangeListener => {
		return {
			onUrlChange: async (url) => {
				const routeInfo = currentRouteInfo.getCurrentRouteInfo()
				if (routeInfo) {
					currentRouteInfo.updateRouteInfoUrl(url)
					const { contextId, pageId } = routeInfo
					const page = await pageProvider(contextId, pageId)
					const pageHandlers = page.getAllImplementersOf<IUrlChangeHandler>(UrlChangeHandlerForPage)
					return Promise.all(pageHandlers.map((handler) => handler.onUrlChange(url)))
				}
			},
		}
	}
)

export const UrlHistoryManager = withDependencies(
	[
		named(MasterPageFeatureConfigSymbol, name),
		named(FeatureExportsSymbol, name),
		BrowserWindowSymbol,
		ViewerModelSym,
		multi(SamePageUrlChangeListenerSymbol),
		CurrentRouteInfoSymbol,
		LoggerSymbol,
	],
	(
		{ popupPages }: RouterMasterPageConfig,
		routerExports: IFeatureExportsStore<typeof name>,
		browserWindow: BrowserWindow,
		viewerModel: ViewerModel,
		samePageUrlChangeListeners: Array<ISamePageUrlChangeListener>,
		currentRouteInfo: ICurrentRouteInfo,
		logger: ILogger
	): IAppWillLoadPageHandler & IUrlHistoryManager => {
		const state: { previousPageId?: string } = {}
		let urlChangeListeners = [...samePageUrlChangeListeners]
		const getCurrentUrl = (): string => browserWindow?.location.href || viewerModel.requestUrl
		const getRelativeUrlInternal = () => getRelativeUrl(getCurrentUrl(), viewerModel.site.externalBaseUrl)
		const getFullUrlWithoutQueryParams = () => {
			const relativeUrl = getRelativeUrlInternal()
			const isHomePageUrl = relativeUrl === './'
			const externalBaseUrl = viewerModel.site.externalBaseUrl
			const replaceStr = isHomePageUrl ? externalBaseUrl : `${externalBaseUrl}/`

			return relativeUrl.replace('./', replaceStr)
		}
		const pushUrl = (
			parsedUrl: URL,
			{ disableScrollToTop, skipHistory }: Omit<NavigationParams, 'anchorDataId'> = {}
		) => {
			if (!browserWindow || !browserWindow.history) {
				return
			}
			const url = parsedUrl.toString()

			const currentUrl = new URL(browserWindow.location.href)
			parsedUrl.searchParams.sort()
			currentUrl.searchParams.sort()

			const historyState: IUrlHistoryState = { scrollY: browserWindow.scrollY }
			if (skipHistory) {
				browserWindow.history.replaceState(historyState, '', url)
			}

			if (currentUrl.toString() === parsedUrl.toString()) {
				return
			}

			if (!skipHistory) {
				browserWindow.history.replaceState(historyState, '', currentUrl.toString())
				try {
					const data = disableScrollToTop ? { scrollY: historyState?.scrollY } : null
					browserWindow.history.pushState(data, '', url)
				} catch (ex) {
					logger.captureError(ex, { tags: { pushStateError: true } })
				}
			}

			const currentPageId = currentRouteInfo.getCurrentRouteInfo()?.pageId

			if (state.previousPageId === currentPageId) {
				urlChangeListeners.forEach((listener) => listener.onUrlChange(new URL(url)))
			}
		}

		const addOnUrlChangeListener: ModifyUrlChangeListeners = (listenerToAdd) =>
			urlChangeListeners.push(listenerToAdd)
		const removeOnUrlChangeListener: ModifyUrlChangeListeners = (listenerToRemove) =>
			(urlChangeListeners = urlChangeListeners.filter((listener) => listener !== listenerToRemove))
		routerExports.export({ addOnUrlChangeListener, removeOnUrlChangeListener })

		return {
			name: 'urlManager',
			appWillLoadPage({ pageId }) {
				// Popups are triggering appWillLoadPage without updating the currentRouteInfo, so we ignore it for
				// deciding whether to samePageUrlChangeListener.onUrlChange() (Otherwise we loose the same page
				// context after a popup is opened).
				if (popupPages[pageId]) {
					return
				}

				// Keeping track of previous page ID so we know when url is changed within the same page (Assuming
				// pushUrlState happens after this appWillLoadPage).
				logger.updatePageId(pageId)
				state.previousPageId = pageId
			},

			pushUrlState: (parsedUrl: URL, navigationParams: Omit<NavigationParams, 'anchorDataId'> = {}) => {
				pushUrl(parsedUrl, navigationParams)
				routerExports.export({
					currentUrl: getFullUrlWithoutQueryParams(),
					currentUrlWithQueryParams: getCurrentUrl(),
					relativeUrl: getRelativeUrlInternal(),
				})
			},

			getHistoryState: () => {
				if (!browserWindow || !browserWindow.history) {
					return null
				}
				return browserWindow.history.state as IUrlHistoryState
			},

			updateHistoryState: (newHistory?: IUrlHistoryState) => {
				if (!browserWindow || !browserWindow.history) {
					return
				}

				if (newHistory) {
					const currentUrl = new URL(browserWindow.location.href)
					currentUrl.searchParams.sort()

					browserWindow.history.replaceState(newHistory, '', currentUrl.toString())
				}

				return
			},

			getParsedUrl: () => new URL(getCurrentUrl()),

			getFullUrlWithoutQueryParams,

			getRelativeUrl: getRelativeUrlInternal,

			getRelativeEncodedUrl: () => getRelativeEncodedUrl(getCurrentUrl(), viewerModel.site.externalBaseUrl),
		}
	}
)

export const PopStateListener = withDependencies(
	[
		multi(PopHistoryStateHandler),
		BrowserWindowSymbol,
		multi(SamePageUrlChangeListenerSymbol),
		CurrentRouteInfoSymbol,
	],
	(
		popStateHandlers: Array<IUrlHistoryPopStateHandler>,
		browserWindow: BrowserWindow,
		samePageUrlChangeListeners: Array<ISamePageUrlChangeListener>,
		currentRouteInfo: ICurrentRouteInfo
	): IAppWillMountHandler => ({
		appWillMount: () => {
			if (!browserWindow) {
				return
			}

			if (browserWindow.history) {
				browserWindow.history.scrollRestoration = 'manual'
			}

			browserWindow.addEventListener('popstate', async () => {
				const href = browserWindow.location.href
				await Promise.all(popStateHandlers.map((handler) => handler.onPopState(new URL(href))))

				const pageIdBeforeHandlingPopState = currentRouteInfo.getPreviousRouterInfo()?.pageId
				const pageIdAfterHandlingPopState = currentRouteInfo.getCurrentRouteInfo()?.pageId
				// when the first url change is due to a navigation to a tpa section, and the back button is hit, there's no prev route info
				if (!pageIdBeforeHandlingPopState || pageIdBeforeHandlingPopState === pageIdAfterHandlingPopState) {
					samePageUrlChangeListeners.forEach((listener) => listener.onUrlChange(new URL(href)))
				}
			})
		},
	})
)
