import _ from 'lodash'
import { IPageProvider, IPageReflector, PageProviderSymbol } from 'feature-pages'
import { LightboxUtilsSymbol, ILightboxUtils } from 'feature-lightbox'
import { multi, named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BusinessLogger,
	BusinessLoggerSymbol,
	CurrentRouteInfoSymbol,
	IAppWillLoadPageHandler,
	ILogger,
	LoggerSymbol,
	PlatformEnvDataProvider,
	PlatformEvnDataProviderSymbol,
	PlatformSiteConfig,
	SdkHandlersProvider,
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
	WixCodeSdkHandlersProviderSym,
} from '@wix/thunderbolt-symbols'
import type { PlatformInitializer } from './types'
import { name, PlatformInitializerSym } from './symbols'
import { DebugApis, TbDebugSymbol } from 'feature-debug'
import { createBootstrapData } from './viewer/createBootstrapData'
import { ICurrentRouteInfo } from 'feature-router'
import { platformUpdatesFunctionsNames } from './constants'
import type { InvokeViewerHandler } from './core/types'
import { INavigationManager, NavigationManagerSymbol } from 'feature-navigation-manager'
import { EventCategories } from '@wix/fe-essentials-viewer-platform/bi'

class PlatformError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PlatformError' // for grouping the errors in the rollout grafana
	}
}

export const Platform = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		PlatformInitializerSym,
		ViewerModelSym,
		LoggerSymbol,
		PageProviderSymbol,
		CurrentRouteInfoSymbol,
		BusinessLoggerSymbol,
		multi(WixCodeSdkHandlersProviderSym),
		multi(PlatformEvnDataProviderSymbol),
		NavigationManagerSymbol,
		optional(LightboxUtilsSymbol),
		optional(TbDebugSymbol),
	],
	(
		platformSiteConfig: PlatformSiteConfig,
		platformRunnerContext: PlatformInitializer,
		viewerModel: ViewerModel,
		logger: ILogger,
		pageProvider: IPageProvider,
		currentRouteInfo: ICurrentRouteInfo,
		businessLogger: BusinessLogger,
		siteHandlersProviders: Array<SdkHandlersProvider<any>>,
		platformEnvDataProviders: Array<PlatformEnvDataProvider>,
		navigationManager: INavigationManager,
		popupUtils?: ILightboxUtils,
		debugApi?: DebugApis
	): IAppWillLoadPageHandler => {
		const siteHandlers = Object.assign({}, ...siteHandlersProviders.map((siteHandlerProvider) => siteHandlerProvider.getSdkHandlers()))

		function getHandlers(page: IPageReflector) {
			const pageHandlersProviders = page.getAllImplementersOf<SdkHandlersProvider<any>>(WixCodeSdkHandlersProviderSym)
			const pageHandlers = pageHandlersProviders.map((pageHandlerProvider) => pageHandlerProvider.getSdkHandlers())
			return Object.assign({}, ...pageHandlers, siteHandlers)
		}

		function getPlatformEnvData() {
			return Object.assign({}, ...platformEnvDataProviders.map((envApiProvider) => envApiProvider.platformEnvData))
		}

		const {
			bootstrapData: siteConfigBootstrapData,
			landingPageId,
			isChancePlatformOnLandingPage,
			debug: { disablePlatform },
		} = platformSiteConfig

		const siteBootstrapData = createBootstrapData({
			platformEnvData: getPlatformEnvData(),
			platformBootstrapData: siteConfigBootstrapData,
			siteFeaturesConfigs: viewerModel.siteFeaturesConfigs,
			currentContextId: 'site',
			currentPageId: 'site',
		})

		platformRunnerContext.initPlatformOnSite(siteBootstrapData, (path: string, ...args: Array<unknown>) => {
			const handler = _.get(siteHandlers, path)

			if (!_.isFunction(handler)) {
				const error = new PlatformError('site handler does not exist in page')
				logger.captureError(error, {
					tags: {
						feature: 'platform',
						handler: path,
					},
					level: 'info',
				})

				if (debugApi) {
					console.warn(error, path)
				}

				return
			}

			return handler(...args)
		})

		return {
			name: 'platform',
			async appWillLoadPage({ pageId: currentPageId, contextId }) {
				// Getting envData on each navigation so it can depend on currentUrl.
				const platformEnvData = getPlatformEnvData()
				const muteFedops = platformEnvData.bi.muteFedops
				if (!muteFedops) {
					logger.interactionStarted('platform')
				}

				const handlersPromise = Promise.all([pageProvider(contextId, currentPageId), pageProvider('masterPage', 'masterPage')]).then(([page, masterPage]) => ({
					masterPageHandlers: getHandlers(masterPage),
					pageHandlers: getHandlers(page),
				}))

				if (disablePlatform || (currentPageId === landingPageId && !isChancePlatformOnLandingPage)) {
					businessLogger.logger.log(
						{
							src: 72,
							evid: 520,
							endpoint: 'bpm',
							params: { widgets_ids: ['NO_APPS'], apps_ids: ['NO_APPS'], page_number: platformEnvData.bi.pageData?.pageNumber },
						},
						{
							category: EventCategories.Essential,
						}
					)
					handlersPromise.then(({ pageHandlers, masterPageHandlers }) => {
						pageHandlers.publicApiTpa?.registerPublicApiGetter(() => [])
						masterPageHandlers.publicApiTpa?.registerPublicApiGetter(() => [])
					})
					return
				}

				const bootstrapData = createBootstrapData({
					platformEnvData,
					platformBootstrapData: siteConfigBootstrapData,
					siteFeaturesConfigs: viewerModel.siteFeaturesConfigs,
					currentContextId: contextId,
					currentPageId,
				})

				const shouldIgnoreCall = () => contextId !== 'masterPage' && !popupUtils?.isLightbox(contextId) && contextId !== currentRouteInfo.getCurrentRouteInfo()?.contextId

				const invokeViewerHandler: InvokeViewerHandler = async (pageId: string, path: Array<string>, ...args: Array<never>) => {
					// #TB-3031 Ignore invocations from handlers that were created on other pages
					// Limiting only setControllerProps and updateProps for tracking events to pass through during navigations
					const functionName = _.last(path) as string
					if (platformUpdatesFunctionsNames.includes(functionName) && shouldIgnoreCall()) {
						return
					}

					const { masterPageHandlers, pageHandlers } = await handlersPromise
					const handlers = pageId === 'masterPage' ? masterPageHandlers : pageHandlers
					const handler = _.get(handlers, path)

					if (!_.isFunction(handler)) {
						const error = new PlatformError('handler does not exist in page')
						logger.captureError(error, {
							tags: {
								feature: 'platform',
								handler: functionName,
								isLightbox: platformEnvData.bi.pageData.isLightbox,
								isDuringNavigation: navigationManager.isDuringNavigation(),
								isMasterPage: pageId === 'masterPage',
							},
							extra: { pageId, contextId, path: path.join('.') },
							level: 'info',
						})

						if (debugApi) {
							console.warn(error, pageId, path)
						}

						return
					}

					return handler(...args)
				}

				if (debugApi) {
					debugApi.platform.logBootstrapMessage(contextId, bootstrapData)
				}

				await platformRunnerContext.runPlatformOnPage(bootstrapData, invokeViewerHandler)
				if (!muteFedops) {
					logger.interactionEnded('platform')
				}
			},
		}
	}
)
