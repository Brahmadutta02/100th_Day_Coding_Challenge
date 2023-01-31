import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PlatformEvnDataProviderSymbol, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { siteEnvDataProvider } from './sdk/siteEnvDataProvider'
import { siteSdkProvider } from './sdk/siteSdkProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(PlatformEvnDataProviderSymbol).to(siteEnvDataProvider)
	bind(WixCodeSdkHandlersProviderSym).to(siteSdkProvider)
}

export * from './symbols'
