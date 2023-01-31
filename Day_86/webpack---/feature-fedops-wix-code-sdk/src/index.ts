import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { FedopsSdkHandlersProvider } from './sdk/FedopsSdkHandlersProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(FedopsSdkHandlersProvider)
}

export const editorPage: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(FedopsSdkHandlersProvider)
}

export * from './symbols'
export * from './types'
