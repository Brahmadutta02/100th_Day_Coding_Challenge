import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Accessibility } from './accessibility'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(LifeCycle.PageDidMountHandler).to(Accessibility)
	}
}
