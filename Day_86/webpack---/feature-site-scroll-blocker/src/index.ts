import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { SiteScrollBlockerSymbol, name } from './symbols'
import { SiteScrollBlocker } from './siteScrollBlocker'

export const site: ContainerModuleLoader = (bind) => {
	bind(SiteScrollBlockerSymbol).to(SiteScrollBlocker)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(SiteScrollBlockerSymbol).to(SiteScrollBlocker)
}

export type { ISiteScrollBlocker, IScrollBlockedListener } from './ISiteScrollBlocker'
export { name, SiteScrollBlockerSymbol }
