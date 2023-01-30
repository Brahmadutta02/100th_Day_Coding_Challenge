import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { HeaderPlaceholderHeight } from './headerPlaceholderHeight'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	// Don't load on SSR
	if (process.env.browser) {
		bind(LifeCycle.PageDidMountHandler).to(HeaderPlaceholderHeight)
	}
}
