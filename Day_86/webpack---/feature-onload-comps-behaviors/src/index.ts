import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { OnloadCompsBehaviors } from './onloadCompsBehaviors'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(OnloadCompsBehaviors)
}
