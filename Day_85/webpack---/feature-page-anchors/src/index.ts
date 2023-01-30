import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PageAnchors } from './pageAnchors'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageWillUnmountHandler).to(PageAnchors)
}
