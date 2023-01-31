import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { siteMembersWixCodeSdkHandlers } from './sdk/siteMembersSdkProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(siteMembersWixCodeSdkHandlers)
}

export * from './symbols'
export * from './types'
