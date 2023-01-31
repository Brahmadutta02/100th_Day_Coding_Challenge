import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WarmupDataAggregatorSymbol, WarmupDataProviderSymbol } from './symbols'
import { WarmupDataProvider } from './warmupDataProvider'
import { WarmupDataAggregator } from './warmupDataAggregator'

export const site: ContainerModuleLoader = (bind) => {
	bind(WarmupDataProviderSymbol).to(WarmupDataProvider)

	if (!process.env.browser) {
		bind(WarmupDataAggregatorSymbol).to(WarmupDataAggregator)
	}
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(WarmupDataProviderSymbol).to(WarmupDataProvider)
}

export {
	WarmupDataAggregatorSymbol,
	WarmupDataProviderSymbol,
	WarmupDataEnricherSymbol,
	WarmupDataPromiseSymbol,
} from './symbols'
export type { IWarmupDataEnricher, IWarmupDataAggregator, IWarmupDataProvider } from './types'
