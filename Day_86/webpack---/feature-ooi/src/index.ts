import { ComponentsRegistrarSymbol } from '@wix/thunderbolt-components-loader'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import { ooiPageWillMount } from './ooi'
import { ooiComponentsRegistrar } from './ooiComponentsRegistrar'
import OOISdkHandlersProvider from './ooiSdkHandlersProvider'
import ReporterFactory, { OOIReporterSymbol, Reporter } from './reporting'
import OOIPostSsrPropsEnricher from './ssr/ooiPostSsrPropsEnricher'
import OOISsrManager from './ssr/ooiSsrManager'
import { ooiLoadComponentsPageWillMountSSR } from './ssr/ooiLoadComponentsPageWillMountSSR'
import { ooiLoadComponentsPageWillMountClient } from './client/ooiLoadComponentsPageWillMountClient'
import {
	ModuleFederationSharedScopeSymbol,
	OOIPageComponentsLoaderSymbol,
	OOISsrManagerSymbol,
	ReactLoaderForOOISymbol,
} from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler, LifeCycle.PageDidMountHandler).to(ooiPageWillMount)
	bind(WixCodeSdkHandlersProviderSym).to(OOISdkHandlersProvider)

	if (process.env.browser) {
		// put new client loading here
		bind(LifeCycle.PageWillMountHandler).to(ooiLoadComponentsPageWillMountClient)
		bind(LifeCycle.PageWillMountHandler).to(require('./client/ooiLoadStaticCSSPageWillMountClient').default)
	} else {
		// put new ssr loading here
		bind(LifeCycle.PageWillMountHandler, OOIPageComponentsLoaderSymbol).to(ooiLoadComponentsPageWillMountSSR)
		bind(LifeCycle.PageWillMountHandler).to(require('./ssr/ooiLoadStaticCSSPageWillMountSSR').default)
	}
}

export const site: ContainerModuleLoader = (bind) => {
	bind(ComponentsRegistrarSymbol).to(ooiComponentsRegistrar)
	bind<Reporter>(OOIReporterSymbol).to(ReporterFactory)
	bind(ModuleFederationSharedScopeSymbol).toConstantValue({})

	if (process.env.browser) {
		bind(ReactLoaderForOOISymbol).to(require('./client/componentsLoaderClient').default)
		bind(LifeCycle.AppWillRenderFirstPageHandler, LifeCycle.AppDidMountHandler).to(OOIPostSsrPropsEnricher)
	} else {
		bind(ReactLoaderForOOISymbol).to(require('./ssr/componentsLoaderSSR').default)
		bind(OOISsrManagerSymbol, WarmupDataEnricherSymbol).to(OOISsrManager)
		bind(LifeCycle.AppWillLoadPageHandler).to(require('./ssr/ssrModuleFederatedPreloadTagsLoader').default)
	}
}

export * from './symbols'
export * from './types'
