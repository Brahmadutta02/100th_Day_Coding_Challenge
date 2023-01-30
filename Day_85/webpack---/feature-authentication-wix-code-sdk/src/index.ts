import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { authenticationCodeSdkHandlersProvider } from './sdk/authenticationSdkProvider'
import { AuthenticationApi } from './authenticationApi'
import { AuthenticationApiSymbol } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(AuthenticationApiSymbol).to(AuthenticationApi)
	bind(WixCodeSdkHandlersProviderSym).to(authenticationCodeSdkHandlersProvider)
}

export * from './symbols'
export * from './types'
export * from './utils'
