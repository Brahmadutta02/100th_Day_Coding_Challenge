import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import {
	LogicalReflectorSymbol,
	PageProviderSymbol,
	PageStructureJsonSymbol,
	PagePropsJsonSymbol,
	PageInitializerSymbol,
} from './symbols'
import type { IPageProvider, IPageReflector, IPageInitializer } from './types'
import { PageProvider } from './PageReflector'
import { LogicalReflector } from './logicalReflector'
import PageBiReporting from './pageBiReporting'
import { PageInitializer } from './pageInitializer'

export const site: ContainerModuleLoader = (bind) => {
	bind<IPageProvider>(PageProviderSymbol).toProvider<IPageReflector>(PageProvider)
	bind(LogicalReflectorSymbol).toProvider<IPageReflector>(LogicalReflector)
	bind(LifeCycle.AppDidMountHandler).to(PageBiReporting)
	bind(PageInitializerSymbol).to(PageInitializer)
}

export {
	PageProviderSymbol,
	LogicalReflectorSymbol,
	PageStructureJsonSymbol,
	PagePropsJsonSymbol,
	IPageProvider,
	IPageReflector,
	IPageInitializer,
	PageInitializerSymbol,
}
