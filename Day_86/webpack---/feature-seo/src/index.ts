import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { SeoSiteSymbol } from './symbols'
import { SeoPageWillMount, SeoPageDidMount, SeoPageWillUnmount } from './seo-page'
import { SeoSite } from './seo-site'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(SeoPageWillMount)
	bind(LifeCycle.PageDidMountHandler).to(SeoPageDidMount)
	bind(LifeCycle.PageWillUnmountHandler).to(SeoPageWillUnmount)
}

export const site: ContainerModuleLoader = (bind) => {
	bind(SeoSiteSymbol).to(SeoSite)
}

export { SeoSiteSymbol }
export * from './symbols'
export * from './types'
export { DEFAULT_STATUS_CODE } from './api/constants'
