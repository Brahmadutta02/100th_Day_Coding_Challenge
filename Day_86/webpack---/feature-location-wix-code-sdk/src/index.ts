import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { locationWixCodeSdkHandlersProvider } from './sdk/locationSdkProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(locationWixCodeSdkHandlersProvider)
}

export * from './symbols'
export * from './types'
