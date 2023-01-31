import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { NavigationManager } from './navigationManager'
import { NavigationPageDidMountHandler } from './navigationPageDidMountHanlder'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { NavigationManagerSymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(NavigationManagerSymbol).to(NavigationManager)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler).to(NavigationPageDidMountHandler)
}

export type { INavigationManager } from './types'
export * from './symbols'
