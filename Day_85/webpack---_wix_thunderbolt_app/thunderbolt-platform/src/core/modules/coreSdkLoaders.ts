import type { IModelsAPI } from '@wix/thunderbolt-symbols'
import { BootstrapData, CoreSdkLoaders } from '../../types'
import type { IViewerHandlers } from '../types'
import { DocumentSdkFactory } from '../componentsSDK/Document'
import { logSdkError, logSdkWarning } from '@wix/thunderbolt-commons'
import {
	APPLICATIONS,
	BOOTSTRAP_DATA,
	COMPONENT_SDK_STATE,
	COMPONENT_SDKS_MANAGER,
	CONTROLLER_EVENTS,
	CONTROLLERS_EXPORTS,
	CORE_SDKS_LOADERS,
	INSTANCE_CACHE,
	MODELS_API,
	VIEWER_HANDLERS,
	WIX_SELECTOR,
} from './moduleNames'
import { IWixSelector } from './wixSelector'
import { IComponentSdksManager, IControllersExports } from '../types'
import { IInstanceCache } from './instanceCache'
import { IControllerEvents } from './controllerEvents'
import { IComponentSdkState } from './componentSdkState'
import { IApplications } from './applications'

const coreSdkLoaders = (
	wixSelector: IWixSelector,
	modelsApi: IModelsAPI,
	bootstrapData: BootstrapData,
	controllersExports: IControllersExports,
	{ viewerHandlers: handlers }: IViewerHandlers,
	sdkInstancesCache: IInstanceCache,
	controllerEvents: IControllerEvents,
	componentSdkState: IComponentSdkState,
	applications: IApplications,
	componentSdksManager: IComponentSdksManager
) => {
	const reporter = {
		logSdkError,
		logSdkWarning,
	}
	const platformEnvData = bootstrapData.platformEnvData

	const AppControllerSdkLoader = async () => {
		const { AppControllerSdk } = await import('../componentsSDK/AppController' /* webpackChunkName: "AppController.corvid" */)
		return AppControllerSdk({ controllersExports, modelsApi, controllerEvents })
	}

	const AppWidgetSdkLoader = async () => {
		const { AppControllerWithChildrenSdk } = await import('../componentsSDK/AppController' /* webpackChunkName: "AppController.corvid" */)
		return AppControllerWithChildrenSdk({ controllersExports, modelsApi, controllerEvents })
	}

	const RepeaterSdkLoader = async () => {
		const { RepeaterSdk } = await import('../componentsSDK/repeaters/Repeater' /* webpackChunkName: "Repeater.corvid" */)
		return RepeaterSdk({
			modelsApi,
			wixSelector,
			reporter,
			sdkInstancesCache,
			componentSdkState,
			platformEnvData,
			createRepeatedControllers: applications.createRepeatedControllers,
			handlers,
		})
	}

	const DocumentSdkLoader = async () =>
		Promise.resolve(
			DocumentSdkFactory({
				modelsApi,
				wixSelector,
				currentPageId: bootstrapData.currentPageId,
			})
		)

	const coreSdks: CoreSdkLoaders = {
		AppController: AppControllerSdkLoader,
		AppWidget: AppWidgetSdkLoader,
		TPAWidget: AppControllerSdkLoader,
		TPASection: AppControllerSdkLoader,
		TPAMultiSection: AppControllerSdkLoader,
		TPAGluedWidget: AppControllerSdkLoader,
		tpaWidgetNative: AppControllerSdkLoader,
		Repeater: RepeaterSdkLoader,
		Document: DocumentSdkLoader,
	}

	return {
		init() {
			componentSdksManager.fetchComponentsSdks(coreSdks)
		},
	}
}

export default {
	factory: coreSdkLoaders,
	deps: [WIX_SELECTOR, MODELS_API, BOOTSTRAP_DATA, CONTROLLERS_EXPORTS, VIEWER_HANDLERS, INSTANCE_CACHE, CONTROLLER_EVENTS, COMPONENT_SDK_STATE, APPLICATIONS, COMPONENT_SDKS_MANAGER],
	name: CORE_SDKS_LOADERS,
}
