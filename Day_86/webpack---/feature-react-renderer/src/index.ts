import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { AppDidMountPromiseSymbol, BatchingStrategySymbol, LifeCycle, RendererSymbol } from '@wix/thunderbolt-symbols'
import type { RendererProps, AppProps, ClientRenderResponse, IRendererPropsProvider } from './types'
import { PageTransitionsHandlerSymbol, RendererPropsProviderSym } from './symbols'
import { bindCommonSymbols } from './bindCommonSymbols'
import { PageTransitionsHandler } from './pageTransitionsHandler'
import { appDidMountPromise, ReactClientRenderer } from './clientRenderer/reactClientRenderer'
import { ClientBatchingStrategy } from './components/clientBatchingStrategy'

export const site: ContainerModuleLoader = (bind) => {
	bindCommonSymbols(bind)
	bind(BatchingStrategySymbol, LifeCycle.AppDidMountHandler).to(ClientBatchingStrategy)
	bind(AppDidMountPromiseSymbol).toConstantValue(appDidMountPromise)
	bind(RendererSymbol).to(ReactClientRenderer)
	bind(PageTransitionsHandlerSymbol, LifeCycle.AppWillLoadPageHandler).to(PageTransitionsHandler)
}

export { RendererProps, AppProps, ClientRenderResponse, RendererPropsProviderSym, IRendererPropsProvider }
