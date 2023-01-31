import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import { windowWixCodeSdkSiteHandlers } from './sdk/windowSdkSiteHandlersProvider'
import { windowWixCodeSdkPageHandlers } from './sdk/windowSdkPageHandlersProvider'
import { WindowWixCodeWarmupDataEnricher } from './warmupDataEnricher'
import { WindowWixCodeSdkWarmupDataEnricherSymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(WindowWixCodeSdkWarmupDataEnricherSymbol, WarmupDataEnricherSymbol).to(WindowWixCodeWarmupDataEnricher)
	bind(WixCodeSdkHandlersProviderSym).to(windowWixCodeSdkSiteHandlers)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(WindowWixCodeSdkWarmupDataEnricherSymbol).to(WindowWixCodeWarmupDataEnricher)
	bind(WixCodeSdkHandlersProviderSym).to(windowWixCodeSdkSiteHandlers)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(windowWixCodeSdkPageHandlers)
}

export const editorPage = page

export * from './symbols'
export * from './types'
