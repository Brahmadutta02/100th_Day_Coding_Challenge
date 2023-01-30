import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { DynamicPages } from './dynamicPages'
import { RoutingMiddleware } from 'feature-router'
import { DynamicPagesSymbol, LifeCycle } from '@wix/thunderbolt-symbols'
import {
	DynamicPagesResponseHandlerSymbol,
	PermissionsHandlerProviderSymbol,
	PermissionsHandlerSymbol,
} from './symbols'
import { DynamicPagesResponseHandler } from './dynamicPagesResponseHandler'
import { PermissionsHandler } from './permissionsHandler'
import { PermissionsHandlerProvider } from './permissionsHandlerProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(RoutingMiddleware.Dynamic, DynamicPagesSymbol).to(DynamicPages)
	bind(DynamicPagesResponseHandlerSymbol).to(DynamicPagesResponseHandler)
	bind(PermissionsHandlerSymbol, LifeCycle.AppWillMountHandler).to(PermissionsHandler)
	bind(PermissionsHandlerProviderSymbol).to(PermissionsHandlerProvider)
}

export { DynamicPagesResponseHandlerSymbol } from './symbols'
export type { DynamicPagesErrorCallbacksAPI } from './types'
