import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ProtectedPagesClientRoutingHandler } from './protectedPagesClient'
import { ProtectedPagesAppWillMountHandler } from './loginAndNavigate'
import { ProtectedPagesServerRoutingHandler } from './protectedPagesServer'
import { RoutingMiddleware } from 'feature-router'
import { LifeCycle, TpaHandlerProviderSymbol } from '@wix/thunderbolt-symbols'
import { ProtectedPageTPAHandlers } from './tpaHandlers'

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(RoutingMiddleware.Protected).to(ProtectedPagesClientRoutingHandler)
		bind(LifeCycle.AppWillMountHandler).to(ProtectedPagesAppWillMountHandler)
	} else {
		bind(RoutingMiddleware.Protected).to(ProtectedPagesServerRoutingHandler)
	}
}

export const page: ContainerModuleLoader = (bind) => {
	bind(TpaHandlerProviderSymbol).to(ProtectedPageTPAHandlers)
}
