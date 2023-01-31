import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { animationsWixCodeSdkParamsProvider } from './sdk/animationsSdkProvider'
import { animationsWixCodeSdkParamsProviderSSR } from './sdk/animationsSdkProviderSSR'

export const page: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(WixCodeSdkHandlersProviderSym, LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler).to(
			animationsWixCodeSdkParamsProvider
		)
	} else {
		bind(WixCodeSdkHandlersProviderSym).to(animationsWixCodeSdkParamsProviderSSR)
	}
}

export * from './symbols'
export * from './types'
