import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidUnmountHandler, PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { ScrollRestorationAPISymbol, name } from './symbols'
import { IScrollRestorationAPI, ScrollRestorationPageConfig } from './types'

const scrollRestorationFactory = (
	{ shouldRestoreScrollPosition }: ScrollRestorationPageConfig,
	scrollRestorationAPI: IScrollRestorationAPI
): IPageDidUnmountHandler => {
	return {
		pageDidUnmount() {
			if (shouldRestoreScrollPosition) {
				const scrollY = scrollRestorationAPI.getScrollYHistoryState()
				if (scrollY) {
					scrollRestorationAPI.restoreScrollPosition()
				} else {
					scrollRestorationAPI.scrollToTop()
				}
			}
		},
	}
}

export const ScrollRestoration = withDependencies(
	[named(PageFeatureConfigSymbol, name), ScrollRestorationAPISymbol],
	scrollRestorationFactory
)
