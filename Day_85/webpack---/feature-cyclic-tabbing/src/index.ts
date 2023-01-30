import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { CyclicTabbing } from './cyclicTabbing'
import { CyclicTabbingSymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(CyclicTabbingSymbol).to(CyclicTabbing)
}

export const editor: ContainerModuleLoader = site

export * from './symbols'
export { isElementTabbable } from './utils'
