import type { IPlatformLogger, ControllerDataItem, AppModule, ClientSpecMapAPI, ModuleLoader } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../../types'
import { getControllerNameFromUrl } from '../getControllerNameFromUrl'
import type { IAppsUrls } from './appsUrls'
import { CLIENT_SPEC_MAP_API, APPS_URLS, MODULE_FEDERATION_MANAGER, MODULE_LOADER, PLATFORM_LOGGER, BOOTSTRAP_DATA } from './moduleNames'

export interface Container {
	init(): Promise<void>

	get(name: string): Promise<() => AppModule>
}

export interface IModuleFederationManager {
	getControllerNameFromUrl(controllerScriptUrl: string): string

	loadAppModule(appDefinitionId: string, viewerScriptUrl: string): Promise<AppModule | null>

	loadControllerModule({ controllerType, applicationId, compId }: Pick<ControllerDataItem, 'controllerType' | 'applicationId' | 'compId'>, viewerScriptUrl: string): Promise<any>
}

const ModuleFederationManager = (
	logger: IPlatformLogger,
	moduleLoader: ModuleLoader,
	appsUrls: IAppsUrls,
	clientSpecMapApi: ClientSpecMapAPI,
	bootstrapData: BootstrapData
): IModuleFederationManager => {
	const isModuleFederated = (appDefinitionId: string) => bootstrapData.platformEnvData.site.experiments['specs.thunderbolt.module_federation'] && clientSpecMapApi.isModuleFederated(appDefinitionId)

	const loadModuleWithModuleFederation = async (viewerScriptUrl: string, appDefinitionId: string, moduleName: string) => {
		const webworkerContainerUrl = viewerScriptUrl.replace('viewerScript.bundle', `webworkerContainer${moduleName}`)
		const container = await moduleLoader.loadModule<Container>(webworkerContainerUrl)
		// Initializes the share scope. This fills it with known provided modules from this build and all remotes
		// This will be replaced by using a shared scope of our own
		// @ts-ignore
		await __webpack_init_sharing__('default')
		// @ts-ignore
		await container.init(__webpack_share_scopes__.default)
		const moduleFactory = await container.get(moduleName)
		return moduleFactory()
	}

	return {
		getControllerNameFromUrl,
		async loadAppModule(appDefinitionId, viewerScriptUrl) {
			const loadMethod = isModuleFederated(appDefinitionId)
				? () => loadModuleWithModuleFederation(viewerScriptUrl, appDefinitionId, 'viewerScript')
				: () => moduleLoader.loadModule<AppModule>(viewerScriptUrl)

			return logger.withReportingAndErrorHandling(
				'script_loaded',
				async () => {
					const appModule = await loadMethod()
					if (!appModule) {
						throw new Error('app module did not expose any api')
					}
					if (!appModule.createControllers) {
						throw new Error(`app module did not expose a createControllers() method. exported methods are: ${Object.keys(appModule)}`)
					}
					return appModule
				},
				{ appDefinitionId }
			)
		},
		async loadControllerModule({ controllerType, applicationId: appDefinitionId, compId: controllerCompId }, viewerScriptUrl) {
			const controllerScriptUrl = appsUrls.getControllerScriptUrl(appDefinitionId, controllerType)
			if (!controllerScriptUrl) {
				return null
			}

			const loadMethod = isModuleFederated(appDefinitionId)
				? () => loadModuleWithModuleFederation(viewerScriptUrl, appDefinitionId, getControllerNameFromUrl(controllerScriptUrl))
				: () => moduleLoader.loadModule(controllerScriptUrl)
			return logger.withReportingAndErrorHandling('controller_script_loaded', loadMethod, {
				appDefinitionId,
				controllerType,
				controllerCompId,
			})
		},
	}
}

export default {
	factory: ModuleFederationManager,
	deps: [PLATFORM_LOGGER, MODULE_LOADER, APPS_URLS, CLIENT_SPEC_MAP_API, BOOTSTRAP_DATA],
	name: MODULE_FEDERATION_MANAGER,
}
