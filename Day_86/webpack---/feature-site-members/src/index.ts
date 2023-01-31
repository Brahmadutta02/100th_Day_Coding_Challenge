import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteMembersApi } from './siteMembersApi'
import { SiteMembersApiSymbol } from './symbols'
import type { SiteMembersSiteConfig } from './types'
import { TpaHandlerProviderSymbol, LifeCycle, IPageWillUnmountHandler } from '@wix/thunderbolt-symbols'
import { SiteMembersTPAHandlers } from './tpaHandlers'
import { SiteMembersComponents } from './components'
import { RoutingMiddleware } from 'feature-router'
import { RenderingBlockingDialogsMiddleware } from './renderingBlockingDialogsMiddleware'

export const site: ContainerModuleLoader = (bind) => {
	bind(SiteMembersApiSymbol, LifeCycle.AppWillMountHandler, LifeCycle.AppDidMountHandler).to(SiteMembersApi)
	bind(RoutingMiddleware.BlockingDialogs).to(RenderingBlockingDialogsMiddleware)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(TpaHandlerProviderSymbol).to(SiteMembersTPAHandlers)
	bind(LifeCycle.PageWillMountHandler).to(SiteMembersComponents)
	bind(LifeCycle.PageWillUnmountHandler).to(
		// This is in order to get the same instance that was created above
		withDependencies<IPageWillUnmountHandler>(
			[SiteMembersApiSymbol],
			(siteMembersApi: IPageWillUnmountHandler) => ({
				pageWillUnmount(pageInfo) {
					return siteMembersApi.pageWillUnmount(pageInfo)
				},
			})
		)
	)
}

export { SiteMembersApiSymbol, SiteMembersSiteConfig }
export { BIEvents } from './biEvents'
export { PrivacyStatus, INTERACTIONS, AUTH_RESULT_REASON } from './constants'
export * from './types'
export { memberDetailsFromDTO, isLoginAcceptableError, isSignupAcceptableError } from './utils'
