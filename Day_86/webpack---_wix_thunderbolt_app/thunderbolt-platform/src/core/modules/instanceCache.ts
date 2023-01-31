import { SdkInstance } from '@wix/thunderbolt-symbols'
import { INSTANCE_CACHE } from './moduleNames'

export type CompCacheParams = {
	controllerCompId: string
	compId: string
	role: string
	itemId?: string
}

export type IInstanceCache = {
	setSdkInstance(compCacheParams: CompCacheParams, instance: SdkInstance): void
	getSdkInstance(compCacheParams: CompCacheParams): SdkInstance | undefined
	clearCacheByPredicate(predicate: (params: CompCacheParams) => boolean): void
}

const CACHE_KEY_DELIMITER = '----'

const InstanceCache = (): IInstanceCache => {
	const instanceCache: Record<string, any> = {}

	const createCacheKey = ({ controllerCompId, compId, role, itemId = '' }: CompCacheParams) =>
		`${controllerCompId}${CACHE_KEY_DELIMITER}${compId}${CACHE_KEY_DELIMITER}${role}${CACHE_KEY_DELIMITER}${itemId}`

	const getCacheParamsFromKey = (key: string) => {
		const [controllerCompId, compId, role, itemId] = key.split(CACHE_KEY_DELIMITER)

		return {
			controllerCompId,
			compId,
			role,
			itemId,
		}
	}

	return {
		setSdkInstance(compCacheParams, instance) {
			const key = createCacheKey(compCacheParams)
			instanceCache[key] = instance
		},
		getSdkInstance(compCacheParams) {
			const key = createCacheKey(compCacheParams)
			return instanceCache[key]
		},
		clearCacheByPredicate(predicate: (cacheParams: CompCacheParams) => boolean) {
			Object.keys(instanceCache).forEach((key) => {
				const params = getCacheParamsFromKey(key)
				if (predicate(params)) {
					delete instanceCache[key]
				}
			})
		},
	}
}

export default {
	factory: InstanceCache,
	deps: [],
	name: INSTANCE_CACHE,
}
