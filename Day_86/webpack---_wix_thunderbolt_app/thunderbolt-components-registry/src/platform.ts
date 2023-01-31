import {
	registry,
	IPlatformComponentsRegistry,
	IPlatformComponentModel,
	ILibraryTopology,
	IRegistryManifest,
	IComponentLoader,
} from '@wix/editor-elements-registry/2.0/platform'
import { createRegistryInstanceCache } from '@wix/editor-elements-registry/2.0/toolbox'
import { getRegistryGlobalNamespace } from './runtime'
import { IRegistryRunAndReport, getReportMetricName } from './metrics'

import _ from 'lodash'

import { FetchResponse } from '@wix/thunderbolt-symbols'

type IComponentSDKs = Record<string, IPlatformComponentModel['sdk']['factory']>

export interface ICreatePlatformRegistryParams {
	libraries: Array<ILibraryTopology | IRegistryManifest>
	mode?: 'lazy' | 'eager'
	fetchFn?: (url: string) => Promise<FetchResponse>
	loadFallbackSDKModule?: () => Promise<IPlatformComponentModel>
}

export interface IComponentSDKLoader {
	sdkTypeToComponentTypes: Record<string, Array<string>>
	loadComponentSdks: (componentTypes: Array<string>) => Promise<IComponentSDKs>
}

export interface IComponentsRegistryPlatform {
	getRegistryAPI: () => IPlatformComponentsRegistry
	getComponentsSDKsLoader: () => IComponentSDKLoader
}

const METRIC_CREATE_REGISTRY = getReportMetricName({ host: 'platform' })
const METRIC_CREATE_REGISTRY_CACHED = getReportMetricName({ host: 'platform', cached: true })

const cache = createRegistryInstanceCache<IPlatformComponentsRegistry>()

export function injectSDK(componentType: string, factory: IPlatformComponentModel['sdk']['factory'], sdkType?: string) {
	const namespace = getRegistryGlobalNamespace()

	if (!namespace.injectedSDKs) {
		namespace.injectedSDKs = {}
	}

	const loader: IComponentLoader<any> = () =>
		Promise.resolve({
			sdk: {
				factory,
			},
		})
	loader.assets = []
	loader.isPartExist = () => false
	loader.statics = { sdkType }

	namespace.injectedSDKs[componentType] = loader
}

export function clearInjectedSDKs() {
	const namespace = getRegistryGlobalNamespace()
	namespace.injectedSDKs = {}
}

function getInjectedSDKs() {
	const namespace = getRegistryGlobalNamespace()
	return namespace.injectedSDKs || {}
}

async function getRegistryAPI({
	libraries,
	fetchFn,
	mode,
	runAndReport,
}: ICreatePlatformRegistryParams & IRegistryRunAndReport): Promise<IPlatformComponentsRegistry> {
	return cache.getRegistryAPI({
		libraries,
		shouldCache: !process.env.browser,
		factory: () => {
			return runAndReport(METRIC_CREATE_REGISTRY, () =>
				registry({
					mode,
					libraries,
					options: {
						useExperimentalEval: !!process.env.browser,
					},
					fetcher: fetchFn
						? async (resourceURL: string) => {
								const response = await fetchFn(resourceURL)
								return response.text()
						  }
						: undefined,
					globals: {
						_,
						lodash: _,
					},
				})
			)
		},
	})
}

export async function createComponentsRegistryPlatform(
	params: ICreatePlatformRegistryParams & IRegistryRunAndReport
): Promise<IComponentsRegistryPlatform> {
	const { loadFallbackSDKModule, runAndReport } = params

	const registryAPI = await runAndReport(METRIC_CREATE_REGISTRY_CACHED, () => getRegistryAPI(params))

	const loaders = registryAPI.getComponentsLoaders()
	Object.assign(loaders, getInjectedSDKs())

	const sdkTypeToComponentTypes: Record<string, Array<string>> = {}

	Object.keys(loaders).forEach((componentType) => {
		const loader = loaders[componentType]

		const key = loader.statics?.sdkType ?? componentType

		if (!sdkTypeToComponentTypes[key]) {
			sdkTypeToComponentTypes[key] = []
		}

		sdkTypeToComponentTypes[key].push(componentType)
	})

	return {
		getComponentsSDKsLoader() {
			return {
				sdkTypeToComponentTypes: { ...sdkTypeToComponentTypes },
				async loadComponentSdks(componentTypes) {
					const [existingComponents, unexistingComponents] = _.partition(
						componentTypes,
						(componentType) => componentType in loaders
					)

					const shouldLoadFallback = loadFallbackSDKModule && unexistingComponents.length !== 0

					const [models, fallbackSDKModule] = await Promise.all([
						registryAPI.loadComponents(existingComponents),
						shouldLoadFallback ? loadFallbackSDKModule!() : null,
					])

					const componentSDKs: IComponentSDKs = {}

					if (fallbackSDKModule) {
						unexistingComponents.forEach((componentType) => {
							componentSDKs[componentType] = fallbackSDKModule.sdk as any
						})
					}

					Object.keys(models).forEach((componentType) => {
						/**
						 * Backward compatibility since we changed the component SDK model
						 * In future should `models[componentType].sdk.factory`
						 */
						const sdk = models[componentType].sdk
						componentSDKs[componentType] = typeof sdk.factory === 'function' ? sdk.factory : (sdk as any)
					})

					return componentSDKs
				},
			}
		},
		getRegistryAPI() {
			return registryAPI
		},
	}
}
