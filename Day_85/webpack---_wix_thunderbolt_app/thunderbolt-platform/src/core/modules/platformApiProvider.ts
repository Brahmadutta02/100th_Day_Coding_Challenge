import type { AppEssentials } from '@wix/fe-essentials-viewer-platform'
import { PLATFORM_API_PROVIDER, MODULE_LOADER, BOOTSTRAP_DATA, WIX_CODE_API_FACTORY } from './moduleNames'
import type { FeatureName, ModuleLoader } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { wixCodeSdkLoaders, wixCodeSdkLoadersNames } from '../../wixCodeSdks'
import { IWixCodeApiFactory } from './wixCodeApiFactory'

const AUTO_FEM_MANIFEST_URL = '/webworker/manifest-worker.min.json'
const AUTO_FEM_URL_NODE = '/viewer-ssr-worker/auto-frontend-modules.umd.min.js'

export interface PlatformApiProvider {
	getPlatformApi: (moduleName: string) => Promise<any>
}

export interface PlatformApiFactory {
	initPlatformApiProvider: (appEssentials: AppEssentials, appDefinitionId: string) => PlatformApiProvider
}

interface PlatformApiFactoryArgs {
	appEssentials: AppEssentials
}

interface AutoFemRegistry {
	namespacesSdkFactory: () => Record<string, (args: PlatformApiFactoryArgs) => Promise<any>>
}

const PlatformApiFactoryProvider = (moduleLoader: ModuleLoader, bootstrapData: BootstrapData, wixCodeApiFactory: IWixCodeApiFactory): PlatformApiFactory => {
	const { platformEnvData, autoFrontendModulesBaseUrl } = bootstrapData
	const { window, site } = platformEnvData

	const shouldInitPlatformApiProvider = Boolean(site.experiments['specs.thunderbolt.InitPlatformApiProvider'])

	const promise = shouldInitPlatformApiProvider
		? window.isSSR
			? moduleLoader.loadModule<AutoFemRegistry>(`${autoFrontendModulesBaseUrl}${AUTO_FEM_URL_NODE}`)
			: fetch(`${autoFrontendModulesBaseUrl}${AUTO_FEM_MANIFEST_URL}`)
					.then((res) => res.json())
					.then((res) => moduleLoader.loadModule<AutoFemRegistry>(res['auto-frontend-modules.js']))
		: new Promise<AutoFemRegistry>((res) => res((undefined as unknown) as AutoFemRegistry))

	return {
		initPlatformApiProvider: (appEssentials: AppEssentials, appDefinitionId: string) => {
			async function getPlatformApi(moduleName: string) {
				if (!shouldInitPlatformApiProvider) {
					throw new Error('PlatformApiProvider was not initialized, pass query param "experiments=specs.thunderbolt.InitPlatformApiProvider"')
				}

				const namespaces = await promise.then(({ namespacesSdkFactory }) => namespacesSdkFactory())
				const module = namespaces[moduleName]

				if (module) {
					return module({ appEssentials })
				}

				if (wixCodeSdkLoaders[wixCodeSdkLoadersNames[moduleName]]) {
					const sdkFactory = await wixCodeApiFactory.initSdkFactory({ loader: wixCodeSdkLoaders[wixCodeSdkLoadersNames[moduleName]], name: moduleName as FeatureName })
					return sdkFactory(appEssentials, appDefinitionId)[moduleName]
				}

				return {}
			}

			return {
				getPlatformApi,
			}
		},
	}
}

export default {
	factory: PlatformApiFactoryProvider,
	deps: [MODULE_LOADER, BOOTSTRAP_DATA, WIX_CODE_API_FACTORY],
	name: PLATFORM_API_PROVIDER,
}
