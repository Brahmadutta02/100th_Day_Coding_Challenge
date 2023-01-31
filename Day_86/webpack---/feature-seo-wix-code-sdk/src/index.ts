import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PlatformEvnDataProviderSymbol, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { seoWixCodeSdkHandlersProvider } from './sdk/seoSdkProvider'
import { seoPlatformEnvDataProvider } from './sdk/seoDataProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(PlatformEvnDataProviderSymbol).to(seoPlatformEnvDataProvider)
	bind(WixCodeSdkHandlersProviderSym).to(seoWixCodeSdkHandlersProvider)
}

export const editor: ContainerModuleLoader = site

export * from './symbols'
export * from './types'
