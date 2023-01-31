import { withDependencies } from '@wix/thunderbolt-ioc'
import type { WarmupDataMap } from '@wix/thunderbolt-symbols'
import type { IWarmupDataProvider } from './types'
import { WarmupDataPromiseSymbol } from './symbols'

export const warmupDataProvider = (warmupDataPromise: Promise<WarmupDataMap>): IWarmupDataProvider => ({
	async getWarmupData<
		WarmupDataType extends WarmupDataMap = never,
		K extends keyof WarmupDataType = keyof WarmupDataType
	>(key: K, { timeout }: { timeout?: number } = {}) {
		const warmupData = Number.isFinite(timeout)
			? Promise.race([warmupDataPromise, new Promise<null>((res) => setTimeout(() => res(null), timeout))])
			: warmupDataPromise

		return ((await warmupData) as Partial<WarmupDataType>)?.[key] ?? null
	},
})

export const WarmupDataProvider = withDependencies([WarmupDataPromiseSymbol], warmupDataProvider)
