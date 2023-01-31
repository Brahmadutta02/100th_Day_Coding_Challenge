import _ from 'lodash'
import type { ManagerSlave } from '@wix/bsi-manager'
import { getDisplayedId, getFullItemId, createPromise } from '@wix/thunderbolt-commons'
import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import type {
	AppModule,
	AppParams,
	IModelsAPI,
	WixCodeApi,
	PlatformAPI,
	ControllersApi,
	IPlatformUtils,
	IPlatformLogger,
	ClientSpecMapAPI,
	ControllerDataAPI,
	ControllerDataItem,
	ControllerInstance,
	PlatformServicesAPI,
	ComponentEventContext,
	WidgetsClientSpecMapData,
	ICommonConfigModule,
} from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { createAppParams } from '../appsAPI/appParams'
import { createControllersParams } from '../appsAPI/controllerParams'
import { createPlatformAppServicesApi } from '../appsAPI/platformServicesAPI'
import type { PlatformDebugApi } from '../debug'
import { importAndInitElementorySupport } from '../elementorySupport'
import type { ControllerData, IComponentSdksManager, IControllersExports, IViewerHandlers } from '../types'
import { BlocksPreviewAppDefId, EVENT_CONTEXT_SCOPE, WixCodeAppDefId } from '../constants'
import type { IAppsUrls } from './appsUrls'
import type { IWixSelector } from './wixSelector'
import type { IAppsPublicApi } from './appsPublicApi'
import type { IInstanceCache } from './instanceCache'
import type { IBlocksAppsUtils } from './blocksAppsUtils'
import type { ISetPropsManager } from './setPropsManager'
import type { IWixCodeApiFactory } from './wixCodeApiFactory'
import type { IWixCodeViewerAppUtils } from './wixCodeViewerAppUtils'
import type { IModuleFederationManager } from './moduleFederationManager'
import type { IDataBindingViewerAppUtils } from './dataBindingViewerAppUtils'
import type { IPlatformApi } from './platformApi'
import type { IStaticEventsManager } from './staticEventsManager'
import type { IRegisterEvent } from './registerEvent'
import type { PlatformApiFactory, PlatformApiProvider } from './platformApiProvider'
import type { ISlotsManager } from './slotsManager'
import {
	APPLICATIONS,
	APPS_PUBLIC_API,
	APPS_URLS,
	BLOCKS_APPS_UTILS,
	BOOTSTRAP_DATA,
	BSI_MANAGER,
	CLIENT_SPEC_MAP_API,
	COMMON_CONFIG,
	COMPONENT_SDKS_MANAGER,
	CONTROLLERS_EXPORTS,
	DATA_BINDING_VIEWER_APP_UTILS,
	DEBUG_API,
	IMPORT_SCRIPTS,
	INSTANCE_CACHE,
	MODELS_API,
	MODULE_FEDERATION_MANAGER,
	PLATFORM_API,
	PLATFORM_API_PROVIDER,
	PLATFORM_ESSENTIALS,
	PLATFORM_LOGGER,
	PLATFORM_UTILS,
	REGISTER_EVENT,
	SET_PROPS_MANAGER,
	SLOTS_MANAGER,
	STATIC_EVENTS_MANAGER,
	VIEWER_HANDLERS,
	WIX_CODE_API_FACTORY,
	WIX_CODE_VIEWER_APP_UTILS,
	WIX_SELECTOR,
} from './moduleNames'

const createControllerItemContext = (repeaterCompId: string, itemId: string) =>
	({
		type: EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE,
		itemId,
		_internal: {
			repeaterCompId,
		},
	} as ComponentEventContext)

export type IApplications = {
	createRepeatedControllers: (repeaterId: string, itemIds: Array<string>) => Promise<any>
	init: () => Promise<any>
}

const Applications = (
	appsPublicApi: IAppsPublicApi,
	wixSelector: IWixSelector,
	modelsApi: IModelsAPI,
	clientSpecMapApi: ClientSpecMapAPI,
	appsUrls: IAppsUrls,
	bootstrapData: BootstrapData,
	importScripts: (url: string) => Promise<void>,
	wixCodeViewerAppUtils: IWixCodeViewerAppUtils,
	blocksAppsUtils: IBlocksAppsUtils,
	dataBindingViewerAppUtils: IDataBindingViewerAppUtils,
	logger: IPlatformLogger,
	wixCodeApiFactory: IWixCodeApiFactory,
	{ createSetPropsForOOI, waitForUpdatePropsPromises }: ISetPropsManager,
	controllersExports: IControllersExports,
	createPlatformApiForApp: IPlatformApi,
	{ bsiManager }: { bsiManager: ManagerSlave },
	platformUtils: IPlatformUtils,
	essentials: ViewerPlatformEssentials,
	commonConfig: ICommonConfigModule,
	{ viewerHandlers }: IViewerHandlers,
	moduleFederationManager: IModuleFederationManager,
	sdkInstancesCache: IInstanceCache,
	staticEventsManager: IStaticEventsManager,
	compEventsManager: IRegisterEvent,
	platformApiFactory: PlatformApiFactory,
	slotsManager: ISlotsManager,
	componentSdksManager: IComponentSdksManager,
	debugApi?: PlatformDebugApi
): IApplications => {
	const {
		wixCodeBootstrapData,
		platformEnvData: {
			bi: { isPreview },
			router: { dynamicRouteData },
			window: { csrfToken },
			site: { viewMode },
			livePreviewOptions,
		},
	} = bootstrapData
	const isEditorMode = viewMode === 'Editor'
	const applications = modelsApi.getApplications()
	const controllerConfigs = modelsApi.getControllerConfigs()
	const connections = modelsApi.getAllConnections()
	const isAppRunning = (appDefId: string | undefined) => appDefId && applications[appDefId]
	const isWixCodeRunning = !!isAppRunning(clientSpecMapApi.getWixCodeAppDefinitionId())
	const isDatabindingRunning = !!isAppRunning(clientSpecMapApi.getDataBindingAppDefinitionId())
	const isBlocksEditorRunning = !!isAppRunning(clientSpecMapApi.getBlocksPreviewAppDefinitionId())
	const isBlocksRunning = _.some(clientSpecMapApi.getBlocksAppsAppDefinitionIds(), (app) => isAppRunning(app))

	const dynamicControllersLifecycles: Array<Promise<void>> = []

	const applicationsParams: {
		[appDefId: string]: {
			viewerScriptUrl: string
			appModule: AppModule
			appParams: AppParams
			widgetsClientSpecMapData: WidgetsClientSpecMapData
			wixCodeApi: WixCodeApi
			platformAppServicesApi: PlatformServicesAPI
			platformApi: PlatformAPI
			controllerModules: any // ModuleFederationManager
			platformApiProvider: PlatformApiProvider
		}
	} = {}

	const loadControllerModules = async (controllersData: Array<ControllerDataItem>, viewerScriptUrl: string) => {
		const controllerModules: { [controllerType: string]: unknown } = {}
		await Promise.all(
			_.map(controllersData, async ({ controllerType, applicationId, compId }: ControllerDataItem) => {
				const controller = await moduleFederationManager.loadControllerModule(
					{
						controllerType,
						applicationId,
						compId,
					},
					viewerScriptUrl
				)
				if (controller) {
					controllerModules[controllerType] = controller
				}
			})
		)
		return controllerModules
	}

	const registerControllerHooks = (controllerCompId: string, controllerParams: ControllerDataAPI, controller: ControllerInstance, wixCodeApi: WixCodeApi) => {
		if (isEditorMode) {
			viewerHandlers.controllers.registerPageReady(controllerCompId, () => controller.pageReady(controllerParams.$w, wixCodeApi))
		}
		if (controllerParams.appParams.appDefinitionId === BlocksPreviewAppDefId && controller.exports) {
			viewerHandlers.controllers.registerExportsSetter(controllerCompId, (props: Record<string, any>) => {
				Object.assign(controller.exports!() as Record<string, any>, props)
			})
		}
		if (controller.updateConfig && isEditorMode) {
			viewerHandlers.controllers.registerToConfigUpdate(controllerCompId, (updatedConfig: unknown) => controller.updateConfig!(controllerParams.$w, updatedConfig))
		}
		if (controller.updateAppSettings && isEditorMode) {
			viewerHandlers.controllers.registerToAppSettingsUpdate(controllerCompId, (updatedSettings: unknown) => controller.updateAppSettings!(controllerParams.$w, updatedSettings))
		}
	}

	const runApplication = async (appDefinitionId: string) => {
		const viewerScriptUrl = appsUrls.getViewerScriptUrl(appDefinitionId)
		if (!viewerScriptUrl) {
			// Might be because clientSpecMap data corruption
			const error = new Error('Could not find viewerScriptUrl. The Application might be missing from the CSM')
			logger.captureError(error, {
				tags: { missingViewerScriptUrl: true },
				extra: { appDefinitionId },
			})
			appsPublicApi.resolvePublicApi(appDefinitionId, null)
			return
		}

		const appModule = await moduleFederationManager.loadAppModule(appDefinitionId, viewerScriptUrl)
		if (!appModule) {
			// error loading app module. errors are reported via moduleLoader.
			appsPublicApi.resolvePublicApi(appDefinitionId, null)
			return
		}
		const appSpecData = clientSpecMapApi.getAppSpecData(appDefinitionId)
		const routerConfigMap = _.filter(bootstrapData.platformAPIData.routersConfigMap, { appDefinitionId })
		const appParams = createAppParams({
			appSpecData,
			wixCodeViewerAppUtils,
			blocksAppsUtils,
			dataBindingViewerAppUtils,
			dynamicRouteData,
			routerConfigMap,
			appInstance: platformUtils.sessionService.getInstance(appDefinitionId),
			baseUrls: appsUrls.getBaseUrls(appDefinitionId),
			viewerScriptUrl,
			blocksData: clientSpecMapApi.getBlocksData(appDefinitionId),
		})
		const instanceId = appParams.instanceId
		const platformApi = createPlatformApiForApp(appDefinitionId, instanceId)
		const platformAppServicesApi = createPlatformAppServicesApi({
			platformEnvData: bootstrapData.platformEnvData,
			appDefinitionId,
			instanceId,
			csrfToken,
			bsiManager,
			sessionService: platformUtils.sessionService,
			essentials,
		})

		const wixCodeApi = await logger.runAsyncAndReport(`init_wix_code_apis ${appDefinitionId}`, () =>
			wixCodeApiFactory.initWixCodeApiForApplication(appDefinitionId, platformAppServicesApi.essentials)
		)
		if (appDefinitionId === WixCodeAppDefId) {
			// TODO refactor storage to be a wix code api, ask all verticals to take it from there instead of platform api and eventually remove from platform api.
			wixCodeApi.storage = platformApi.storage
		}

		if (appModule.initAppForPage) {
			await logger.withReportingAndErrorHandling('init_app_for_page', () => appModule.initAppForPage!(appParams, platformApi, wixCodeApi, platformAppServicesApi), { appDefinitionId })
		}

		const widgetsClientSpecMapData = clientSpecMapApi.getWidgetsClientSpecMapData(appDefinitionId)

		const controllersData = _(applications[appDefinitionId])
			.values()
			.map((controller) => {
				const controllerCompId = controller.compId
				const controllerConfig = controllerConfigs[appDefinitionId][controllerCompId]
				const controllers = [{ ...controller, config: controllerConfig }] as Array<ControllerData>

				// TODO consider not repeating controllers in static items if the repeater is connected to data binding
				if (modelsApi.isRepeaterTemplate(controllerCompId)) {
					// if controller inside repeater template => create a controller params for each item, with its own context
					const repeaterCompId = modelsApi.getRepeaterIdByCompId(controllerCompId)!
					const repeatedControllerConfigs = modelsApi.getRepeatedControllersConfigs(appDefinitionId, controllerCompId)
					_.forEach(repeatedControllerConfigs, (repeatedControllerConfig, repeatedControllerCompId) => {
						const itemId = getFullItemId(repeatedControllerCompId)
						controllers.push({
							...controller,
							config: repeatedControllerConfig,
							context: createControllerItemContext(repeaterCompId, itemId),
						})
					})
				}

				return controllers
			})
			.flatten()
			.value()

		const platformApiProvider = platformApiFactory.initPlatformApiProvider(platformAppServicesApi.essentials, appDefinitionId)

		const controllersParams = createControllersParams(
			createSetPropsForOOI,
			controllersData,
			connections,
			wixSelector,
			slotsManager,
			widgetsClientSpecMapData,
			appParams,
			wixCodeApi,
			platformAppServicesApi,
			platformApi,
			csrfToken,
			essentials,
			platformAppServicesApi.essentials,
			platformApiProvider,
			livePreviewOptions
		)

		if (appDefinitionId === WixCodeAppDefId) {
			debugApi?.setWixCodeInterfaces({ wixCodeApi, $w: controllersParams[0].controllerParams.$w })
		}

		const controllerModules = await loadControllerModules(controllersData, viewerScriptUrl)
		logger.reportAppPhasesNetworkAnalysis(appDefinitionId)

		// cache params for creating dynamically added controllers
		applicationsParams[appDefinitionId] = {
			viewerScriptUrl,
			appModule,
			appParams,
			widgetsClientSpecMapData,
			wixCodeApi,
			platformAppServicesApi,
			platformApi,
			controllerModules,
			platformApiProvider,
		}

		await componentSdksManager.waitForSdksToLoad()
		const controllerPromises = await logger.withReportingAndErrorHandling(
			'create_controllers',
			() =>
				appModule.createControllers(
					controllersParams.map((item) => item.controllerParams),
					controllerModules
				),
			{ appDefinitionId }
		)

		const controllersApi: ControllersApi = { getAll: () => controllerPromises || [] }
		const exports = _.isFunction(appModule.exports) ? appModule.exports({ controllersApi }) : appModule.exports

		appsPublicApi.resolvePublicApi(appDefinitionId, exports) // todo @nitzanh - support dynamic items' controllers

		if (!controllerPromises) {
			return
		}

		await Promise.all(
			controllerPromises.map(async (controllerPromise, index) => {
				const { controllerCompId, controllerParams } = controllersParams[index]
				const reportingParams = { appDefinitionId, controllerType: controllerParams.type, controllerCompId }
				const controller = await logger.withReportingAndErrorHandling('await_controller_promise', () => controllerPromise, reportingParams)
				if (!controller) {
					return
				}

				const controllerContext = controllersData[index].context
				const repeatedController = !!controllerContext
				controllersExports[repeatedController ? getDisplayedId(controllerCompId, controllerContext.itemId) : controllerCompId] = controller.exports
				const pageReadyFunc = () => Promise.resolve(controller.pageReady(controllerParams.$w, wixCodeApi))
				wixSelector.onPageReady(() => logger.withReportingAndErrorHandling('controller_page_ready', pageReadyFunc, reportingParams), controllerCompId, repeatedController)
				registerControllerHooks(controllerCompId, controllerParams, controller, wixCodeApi)
			})
		)
	}

	const runApplications = async (appDefinitionIds: Array<string>) => {
		if (isWixCodeRunning || isDatabindingRunning || isBlocksRunning || isBlocksEditorRunning) {
			await importAndInitElementorySupport({
				importScripts,
				wixCodeBootstrapData,
				sessionService: platformUtils.sessionService,
				viewMode: isPreview ? 'preview' : 'site',
				csrfToken,
				commonConfig,
				logger,
				platformEnvData: bootstrapData.platformEnvData,
			})
		}
		appsPublicApi.registerPublicApiProvider(runApplication)

		await Promise.all(
			_.map(appDefinitionIds, (appDefinitionId) =>
				runApplication(appDefinitionId).catch((error) => {
					appsPublicApi.resolvePublicApi(appDefinitionId, null)
					logger.captureError(error, { tags: { method: 'runApplication' }, extra: { appDefinitionId } })
				})
			)
		)

		await wixSelector.flushOnReadyCallbacks()
		await Promise.all(dynamicControllersLifecycles)
		await waitForUpdatePropsPromises()

		if (process.env.browser) {
			// calling it here because we need to run all the applications, register the controllers APIs, run and finish all pageReady/onReady, before executing any static events handlers.
			// some handlers may depend on the apis being registered and onReady been called.
			await staticEventsManager.triggerStaticEventsHandlers()
			await compEventsManager.waitForEventsToBeRegistered()
		}
	}

	return {
		init: async () => {
			const appDefinitionIds = modelsApi.getApplicationIds()
			if (_.isEmpty(appDefinitionIds) || modelsApi.allControllersOnPageAreGhosts()) {
				return
			}

			return logger.runAsyncAndReport('runApplications', () => runApplications(appDefinitionIds))
		},
		createRepeatedControllers: async (repeaterId: string, itemIds: Array<string>) => {
			// TODO we should probably recurse here to create also controllers in repeater in repeater
			const appToControllers = modelsApi.getRepeatedControllers(repeaterId) // {[appDefId]: appControllersInRepeater}

			if (_.isEmpty(appToControllers)) {
				return _.noop
			}

			const { promise: dynamicControllersLifecycle, resolver: resolveDynamicControllersLifecycle } = createPromise<void>()
			dynamicControllersLifecycles.push(dynamicControllersLifecycle)

			await Promise.all(
				_.map(appToControllers, async (controllers, appDefinitionId) => {
					if (!applicationsParams[appDefinitionId]) {
						return _.noop
					}
					const { appModule, appParams, widgetsClientSpecMapData, wixCodeApi, platformAppServicesApi, platformApi, controllerModules, platformApiProvider } = applicationsParams[
						appDefinitionId
					]
					const controllersData = _(controllers)
						.map((controller, controllerCompId) => {
							return itemIds.map((itemId) => {
								return {
									...controller,
									config: controllerConfigs[appDefinitionId][controllerCompId],
									context: createControllerItemContext(repeaterId, itemId),
								}
							})
						})
						.flatten()
						.value()

					const controllersParams = createControllersParams(
						createSetPropsForOOI,
						controllersData,
						connections,
						wixSelector,
						slotsManager,
						widgetsClientSpecMapData,
						appParams,
						wixCodeApi,
						platformAppServicesApi,
						platformApi,
						csrfToken,
						essentials,
						platformAppServicesApi.essentials,
						platformApiProvider,
						livePreviewOptions
					)

					const controllerPromises = appModule.createControllers(
						controllersParams.map((item) => item.controllerParams),
						controllerModules
					)

					return Promise.all(
						controllerPromises.map(async (controllerPromise, index) => {
							const { controllerCompId, controllerParams } = controllersParams[index]
							const controller = await controllerPromise
							const itemId = controllersData[index].context.itemId
							controllersExports[getDisplayedId(controllerCompId, itemId)] = controller.exports
							sdkInstancesCache.clearCacheByPredicate((compCacheParams) => compCacheParams.compId === controllerCompId && compCacheParams.itemId === itemId)
							const pageReadyFunc = () => Promise.resolve(controller.pageReady(controllerParams.$w, wixCodeApi))
							wixSelector.onPageReady(pageReadyFunc, controllerCompId, true)
							registerControllerHooks(controllerCompId, controllerParams, controller, wixCodeApi)
						})
					)
				})
			)

			return async () => {
				await wixSelector.flushOnReadyCallbacks()
				resolveDynamicControllersLifecycle()
			}
		},
	}
}

export default {
	factory: Applications,
	deps: [
		APPS_PUBLIC_API,
		WIX_SELECTOR,
		MODELS_API,
		CLIENT_SPEC_MAP_API,
		APPS_URLS,
		BOOTSTRAP_DATA,
		IMPORT_SCRIPTS,
		WIX_CODE_VIEWER_APP_UTILS,
		BLOCKS_APPS_UTILS,
		DATA_BINDING_VIEWER_APP_UTILS,
		PLATFORM_LOGGER,
		WIX_CODE_API_FACTORY,
		SET_PROPS_MANAGER,
		CONTROLLERS_EXPORTS,
		PLATFORM_API,
		BSI_MANAGER,
		PLATFORM_UTILS,
		PLATFORM_ESSENTIALS,
		COMMON_CONFIG,
		VIEWER_HANDLERS,
		MODULE_FEDERATION_MANAGER,
		INSTANCE_CACHE,
		STATIC_EVENTS_MANAGER,
		REGISTER_EVENT,
		PLATFORM_API_PROVIDER,
		SLOTS_MANAGER,
		COMPONENT_SDKS_MANAGER,
		DEBUG_API,
	],
	name: APPLICATIONS,
}
