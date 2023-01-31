import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WindowScroll } from './windowScroll'
import { ResolvableReadyForScrollPromiseSymbol, WindowScrollApiSymbol, name } from './symbols'
import type { IWindowScrollAPI } from './types'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { ResolvableReadyForScrollPromise, ResolveReadyForScroll } from './pageReadyForScroll'

export { name, WindowScrollApiSymbol, IWindowScrollAPI }

export const page: ContainerModuleLoader = (bind) => {
	bind<IWindowScrollAPI>(WindowScrollApiSymbol).to(WindowScroll)
	bind(ResolvableReadyForScrollPromiseSymbol).to(ResolvableReadyForScrollPromise)
	bind(LifeCycle.PageDidMountHandler).to(ResolveReadyForScroll)
}

export const editorPage = page
