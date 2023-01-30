import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { Sosp } from './sosp'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(Sosp)
}
