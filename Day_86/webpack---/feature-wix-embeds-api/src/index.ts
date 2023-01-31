import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixEmbedsApiSite } from './wixEmbedsApiSite'
import { WixEmbedsApiPageNavigation } from './wixEmbedsApiPageNavigation'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(LifeCycle.AppWillMountHandler).to(WixEmbedsApiSite)
	}
}

export const page: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(LifeCycle.PageDidMountHandler).to(WixEmbedsApiPageNavigation)
	}
}
