import _ from 'lodash'
import { createPromise } from '@wix/thunderbolt-commons'
import type { IComponentSdksManager } from '../types'
import type { IPlatformLogger, IModelsAPI } from '@wix/thunderbolt-symbols'
import type { ComponentSdks, ComponentSdksLoader, CoreSdkLoaders } from '../../types'
import { LOAD_COMPONENT_SDKS_PROMISE, COMPONENT_SDKS_MANAGER, MODELS_API, PLATFORM_LOGGER } from './moduleNames'

const getSdkTypesToLoad = (modelsApi: IModelsAPI) => {
	const compIdToConnections = modelsApi.getCompIdConnections()
	const slots = modelsApi.getSlots()

	return [
		'PageBackground',
		..._(modelsApi.getStructureModel())
			.transform((sdkTypes, compStructure, compId) => {
				if (compIdToConnections[compId] || slots[compId]) {
					sdkTypes[compStructure.componentType] = true
				}
			}, {} as Record<string, boolean>)
			.keys()
			.value(),
	]
}

const ComponentSdksManager = (loadComponentSdksPromise: Promise<ComponentSdksLoader>, modelsApi: IModelsAPI, logger: IPlatformLogger): IComponentSdksManager => {
	const componentsSdks: ComponentSdks = {}
	const sdkTypesToCompTypesMapper: ComponentSdksLoader['sdkTypeToComponentTypes'] = {}
	const { resolver: sdkResolver, promise: sdkPromise } = createPromise()

	const loadCoreComponentSdks = async (compTypes: Array<string>, coreSdksLoaders: CoreSdkLoaders) => {
		const compsPromises = [...compTypes, 'Document']
			.filter((type) => coreSdksLoaders[type])
			.map((type) =>
				coreSdksLoaders[type]()
					.then((sdkFactory) => ({ [type]: sdkFactory }))
					.catch((e) => {
						if (e.name !== 'NetworkError') {
							logger.captureError(new Error('could not load core component SDKs from thunderbolt'), {
								groupErrorsBy: 'values',
								tags: { method: 'loadCoreComponentSdks', error: `${e.name}: ${e.message}` },
								extra: { type },
							})
						}
						return {}
					})
			)
		const sdksArray = await Promise.all(compsPromises)
		return Object.assign({}, ...sdksArray)
	}

	return {
		async fetchComponentsSdks(coreSdksLoaders: CoreSdkLoaders) {
			const compTypes = getSdkTypesToLoad(modelsApi)
			logger.interactionStarted('loadComponentSdk')
			const { loadComponentSdks, sdkTypeToComponentTypes } = await loadComponentSdksPromise
			Object.assign(sdkTypesToCompTypesMapper, sdkTypeToComponentTypes || {})
			if (!loadComponentSdks) {
				sdkResolver()
				return
			}
			const componentSdksPromise = loadComponentSdks(compTypes, logger).catch((e) => {
				if (e.name !== 'NetworkError') {
					logger.captureError(new Error('could not load component SDKs from loadComponentSdks function'), {
						groupErrorsBy: 'values',
						tags: { method: 'loadComponentSdks', error: `${e.name}: ${e.message}` },
						extra: { compTypes },
					})
				}
				return {}
			})
			const [coreSdks, sdks] = await Promise.all([loadCoreComponentSdks(compTypes, coreSdksLoaders), componentSdksPromise]).catch(() => [])
			Object.assign(componentsSdks, sdks, coreSdks)
			sdkResolver()
			logger.interactionEnded('loadComponentSdk')
		},
		waitForSdksToLoad() {
			return sdkPromise
		},
		getComponentSdkFactory(compType) {
			const sdkFactory = componentsSdks[compType]
			if (!sdkFactory) {
				logger.captureError(new Error('could not find component SDK'), {
					groupErrorsBy: 'values',
					tags: { method: 'loadComponentSdks', compType },
				})
				return
			}
			return sdkFactory
		},
		getSdkTypeToComponentTypes(sdkType: string) {
			return sdkTypesToCompTypesMapper[sdkType] || [sdkType]
		},
	}
}

export default {
	factory: ComponentSdksManager,
	deps: [LOAD_COMPONENT_SDKS_PROMISE, MODELS_API, PLATFORM_LOGGER],
	name: COMPONENT_SDKS_MANAGER,
}
