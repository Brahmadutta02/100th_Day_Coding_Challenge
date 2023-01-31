import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, LinkClickHandlerSymbol } from '@wix/thunderbolt-symbols'
import { SamePageScroll } from './samePageScroll'
import { PostNavigationScroll } from './postNavigationScroll'
import {
	SamePageScrollSymbol,
	AnchorCompIdProviderSymbol,
	ScrollToAnchorHandlerProviderSymbol,
	SamePageAnchorPropsResolverSymbol,
} from './symbols'
import { AnchorDataItCompIdProvider } from './anchorCompIdProvider'
import { SamePageScrollClickHandler } from './samePageScrollClickHandler'
import type { ISamePageScroll } from './types'
import { SamePageAnchorHrefUpdater } from './samePageAnchorHrefUpdater'
import { ScrollToAnchorHandlerProvider } from './scrollToAnchorHandlerProvider'
import { SamePageAnchorPropsResolver } from './samePageAnchorPropsResolver'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidLoadPageHandler).to(PostNavigationScroll)
	bind(ScrollToAnchorHandlerProviderSymbol).to(ScrollToAnchorHandlerProvider)
	bind(AnchorCompIdProviderSymbol).to(AnchorDataItCompIdProvider)
	bind(SamePageScrollSymbol, LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler).to(SamePageScroll)
	bind(LinkClickHandlerSymbol).to(SamePageScrollClickHandler)
	bind(SamePageAnchorPropsResolverSymbol).to(SamePageAnchorPropsResolver)
	bind(LifeCycle.PageWillMountHandler).to(SamePageAnchorHrefUpdater)
}

export { name, SamePageScrollSymbol } from './symbols'

// Public Types
export { ISamePageScroll }
