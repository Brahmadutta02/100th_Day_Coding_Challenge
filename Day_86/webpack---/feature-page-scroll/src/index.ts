import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, PageScrollRegistrarSymbol } from '@wix/thunderbolt-symbols'
import { PageScroll } from './pageScrollRegistrar'
import { name } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler, PageScrollRegistrarSymbol).to(PageScroll)
}

export * from './types'
export { name, PageScrollRegistrarSymbol }
