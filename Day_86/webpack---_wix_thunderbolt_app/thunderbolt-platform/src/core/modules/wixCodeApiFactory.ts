import _ from 'lodash'
import type { AppEssentials } from '@wix/fe-essentials-viewer-platform'
import type { IPlatformUtils, WixCodeApi, FeatureName, IPlatformLogger, ClientSpecMapAPI, IModelsAPI, IWixCodeNamespacesRegistry, ModuleLoader, OnPageWillUnmount } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { wixCodeSdkFactories, WixCodeSdkLoader } from '../../wixCodeSdks'
import type { IWixCodeViewerAppUtils } from './wixCodeViewerAppUtils'
import {
	MODELS_API,
	WIX_CODE_API_FACTORY,
	MODULE_LOADER,
	BOOTSTRAP_DATA,
	PLATFORM_UTILS,
	PLATFORM_LOGGER,
	VIEWER_HANDLERS,
	CLIENT_SPEC_MAP_API,
	ON_PAGE_WILL_UNMOUNT,
	WIX_CODE_VIEWER_APP_UTILS,
	WIX_CODE_NAMESPACES_REGISTRY,
} from './moduleNames'
import { IViewerHandlers } from '../types'

export type IWixCodeApiFactory = {
	initWixCodeApiForApplication: (appDefinitionId: string, appEssentials: AppEssentials) => Promise<WixCodeApi>
	initSdkFactory: ({ loader, name }: { loader: WixCodeSdkLoader; name: FeatureName }) => Promise<SdkFactory>
}

type SdkFactory = (appEssentials: AppEssentials, appDefinitionId: string) => { [namespace: string]: any }

const WixCodeApiFactory = (
	bootstrapData: BootstrapData,
	wixCodeViewerAppUtils: IWixCodeViewerAppUtils,
	modelsApi: IModelsAPI,
	clientSpecMapApi: ClientSpecMapAPI,
	platformUtils: IPlatformUtils,
	{ viewerHandlers }: IViewerHandlers,
	logger: IPlatformLogger,
	wixCodeNamespacesRegistry: IWixCodeNamespacesRegistry,
	moduleLoader: ModuleLoader,
	onPageWillUnmount: OnPageWillUnmount
): IWixCodeApiFactory => {
	const { platformEnvData } = bootstrapData
	const internalNamespaces = {
		// TODO: move this somewhere else
		events: {
			setStaticEventHandlers: wixCodeViewerAppUtils.setStaticEventHandlers,
		},
	}

	async function initSdkFactory({ loader, name }: { loader: WixCodeSdkLoader; name: FeatureName }) {
		const featureMasterPageConfig = modelsApi.getFeatureMasterPageConfig(name)
		const featurePageConfig = modelsApi.getFeaturePageConfig(name)
		const featureSiteConfig = bootstrapData.sdkFactoriesSiteFeatureConfigs[name] || {}
		const sdkFactory = await loader({ modelsApi, clientSpecMapApi, platformEnvData })

		return (appEssentials: AppEssentials, appDefinitionId: string) =>
			sdkFactory({
				featureConfig: { ...featureSiteConfig, ...featurePageConfig, ...featureMasterPageConfig },
				handlers: viewerHandlers,
				appEssentials,
				platformUtils,
				platformEnvData,
				appDefinitionId,
				moduleLoader,
				onPageWillUnmount,
				wixCodeNamespacesRegistry: {
					get: (namespace: keyof WixCodeApi) => wixCodeNamespacesRegistry.get(namespace, appDefinitionId),
				},
			})
	}

	const createWixCodeApiFactories = () => Promise.all(_.map(wixCodeSdkFactories, (loader, name: FeatureName) => initSdkFactory({ loader, name })))

	// @ts-ignore
	const wixCodeSdksPromise: Promise<Array<SdkFactory>> = logger.runAsyncAndReport('createWixCodeApi', createWixCodeApiFactories)

	return {
		initSdkFactory,
		initWixCodeApiForApplication: async (appDefinitionId: string, appEssentials: AppEssentials) => {
			const factories = await wixCodeSdksPromise
			const wixCodeSdkArray = await Promise.all(_.map(factories, (factory) => factory(appEssentials, appDefinitionId))) // members API (users) returns a promise.
			const wixCodeApi = Object.assign({}, internalNamespaces, ...wixCodeSdkArray)
			wixCodeNamespacesRegistry.registerWixCodeNamespaces(wixCodeApi, appDefinitionId)
			return wixCodeApi
		},
	}
}

export default {
	factory: WixCodeApiFactory,
	deps: [
		BOOTSTRAP_DATA,
		WIX_CODE_VIEWER_APP_UTILS,
		MODELS_API,
		CLIENT_SPEC_MAP_API,
		PLATFORM_UTILS,
		VIEWER_HANDLERS,
		PLATFORM_LOGGER,
		WIX_CODE_NAMESPACES_REGISTRY,
		MODULE_LOADER,
		ON_PAGE_WILL_UNMOUNT,
	],
	name: WIX_CODE_API_FACTORY,
}
