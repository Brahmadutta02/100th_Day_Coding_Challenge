import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym, LifeCycle } from '@wix/thunderbolt-symbols'
import { dashboardWixCodeSdkHandlersSSR } from './sdk/dashboardSdkProviderSSR'
import { popupApiProvider } from './sdk/popupApiProvider'

export const PopupProviderSymbol = Symbol('PopupProviderSymbol')

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(WixCodeSdkHandlersProviderSym, LifeCycle.AppWillMountHandler, LifeCycle.AppDidMountHandler).to(
			require('./sdk/dashboardSdkProvider').dashboardWixCodeSdkHandlers
		)
		bind(PopupProviderSymbol).toProvider(popupApiProvider)
	} else {
		bind(WixCodeSdkHandlersProviderSym).to(dashboardWixCodeSdkHandlersSSR)
	}
}

export * from './symbols'
export * from './types'
