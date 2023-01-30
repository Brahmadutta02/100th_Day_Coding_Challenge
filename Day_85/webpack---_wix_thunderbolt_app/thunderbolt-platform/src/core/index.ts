import _ from 'lodash'
import { getModules } from '@wix/simple-module-loader'
import { getComponentsSDKLoader } from '@wix/thunderbolt-components-registry/getComponentsSDKLoader'
import { createPromise, createProxy } from '@wix/thunderbolt-commons'
import type { IPlatformLogger, StorageInitData } from '@wix/thunderbolt-symbols'
import { createStorageAPI } from '../storage/storageAPI'
import type { BootstrapData, ComponentSdksLoader, CreateWixStorageAPI, WixStorageAPI } from '../types'
import { PlatformLogger } from './platformLogger'
import { ViewerHandlers } from './viewerHandlers'
import { UnfinishedTasks } from './unfinishedTasks'
import { ModelsApiProvider } from './modelsApiProvider'
import type { InitArgs, InvokeSiteHandler } from './types'
import {
	PLATFORM_LOGGER,
	LOAD_COMPONENT_SDKS_PROMISE,
	ON_PAGE_WILL_UNMOUNT,
	CREATE_STORAGE_API,
	UNFINISHED_TASKS,
	VIEWER_HANDLERS,
	SESSION_SERVICE,
	GET_COMP_BY_REF_ID,
	IMPORT_SCRIPTS,
	BOOTSTRAP_DATA,
	MODULE_LOADER,
	MODELS_API,
	DEBUG_API,
} from './modules/moduleNames'
import moduleFactories from './modules'

type PlatformState = {
	createStorageApi: CreateWixStorageAPI
	loadComponentSdksPromise: Promise<ComponentSdksLoader>
}

export function createPlatformAPI() {
	const { promise: waitForInit, resolver: initDone } = createPromise<PlatformState>()

	return {
		initPlatformOnSite({ logger, bootstrapData }: { logger: IPlatformLogger; bootstrapData: BootstrapData }, invokeSiteHandler: InvokeSiteHandler) {
			const siteStorageApi: CreateWixStorageAPI = createStorageAPI({ invokeSiteHandler })

			initDone({
				createStorageApi: (appPrefix: string, handlers: any, storageInitData: StorageInitData): WixStorageAPI => {
					return siteStorageApi(appPrefix, handlers, storageInitData)
				},
				loadComponentSdksPromise: getComponentsSDKLoader({
					componentsRegistryEnvData: bootstrapData.platformEnvData.componentsRegistry,
					logger,
				}) as any, // TODO: remove `as any` after https://github.com/wix-private/editor-elements/pull/3443 is merged
			})
		},

		async runPlatformOnPage({
			bootstrapData,
			importScripts,
			moduleLoader,
			invokeViewerHandler,
			modelsProviderFactory,
			sessionService,
			debugApi,
			flushPendingUpdates = _.noop,
			onPageWillUnmount,
			platformPerformanceStore,
		}: InitArgs) {
			const { createStorageApi, loadComponentSdksPromise } = await waitForInit

			const viewerHandlers = ViewerHandlers(invokeViewerHandler, bootstrapData)
			const { viewerHandlers: handlers } = viewerHandlers
			const unfinishedTasks = UnfinishedTasks(viewerHandlers)
			const logger = PlatformLogger(bootstrapData, sessionService, unfinishedTasks, platformPerformanceStore, handlers.ssr.ssrLog)
			logger.interactionStarted('initialisation')
			const modelBuilder = ModelsApiProvider(bootstrapData, modelsProviderFactory, logger)
			const modelsApi = await logger.runAsyncAndReport('getAllModels', modelBuilder.getModelApi)

			const getCompByRefId = (compId: string) =>
				createProxy((functionName: string) => (...args: any) => {
					// wait for all stores to be updated before a potential (re)render of a component.
					// specifically, when changing a state of a state box, we want the target state props to be ready.
					flushPendingUpdates()
					return handlers.platform.invokeCompRefFunction(compId, functionName, args)
				})

			const modules = await getModules({
				[DEBUG_API]: debugApi,
				[MODELS_API]: modelsApi,
				[MODULE_LOADER]: moduleLoader,
				[BOOTSTRAP_DATA]: bootstrapData,
				[IMPORT_SCRIPTS]: importScripts,
				[GET_COMP_BY_REF_ID]: getCompByRefId,
				[SESSION_SERVICE]: sessionService,
				[VIEWER_HANDLERS]: viewerHandlers,
				[UNFINISHED_TASKS]: unfinishedTasks,
				[CREATE_STORAGE_API]: createStorageApi,
				[ON_PAGE_WILL_UNMOUNT]: onPageWillUnmount,
				[LOAD_COMPONENT_SDKS_PROMISE]: loadComponentSdksPromise,
				[PLATFORM_LOGGER]: logger,
				...moduleFactories,
			})
			const modulesToInit = _.values(modules).filter((m) => m && _.isFunction(m.init))
			logger.interactionEnded('initialisation')
			await Promise.all(modulesToInit.map((module) => module.init()))
		},
	}
}
