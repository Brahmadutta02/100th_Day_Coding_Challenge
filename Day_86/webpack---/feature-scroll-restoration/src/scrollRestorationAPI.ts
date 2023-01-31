import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow } from '@wix/thunderbolt-symbols'
import { UrlHistoryManagerSymbol, IUrlHistoryManager } from 'feature-router'
import { IScrollRestorationAPI } from './types'
import { isSSR } from '@wix/thunderbolt-commons'

const scrollRestorationFactory = (
	browserWindow: BrowserWindow,
	urlHistoryManager: IUrlHistoryManager
): IScrollRestorationAPI => {
	const getScrollYHistoryState = () => {
		const state = urlHistoryManager.getHistoryState()
		return state?.scrollY
	}

	return {
		getScrollYHistoryState,
		updateHistoryStateCurrentScrollY() {
			if (!isSSR(browserWindow)) {
				urlHistoryManager.updateHistoryState({ scrollY: browserWindow.scrollY })
			}
		},
		restoreScrollPosition() {
			if (!isSSR(browserWindow)) {
				const scrollY = getScrollYHistoryState()
				if (scrollY) {
					browserWindow.scrollTo(0, scrollY)
				}
			}
		},
		scrollToTop() {
			if (!isSSR(browserWindow)) {
				browserWindow.scrollTo(0, 0)
			}
		},
	}
}

export const ScrollRestorationAPI = withDependencies(
	[BrowserWindowSymbol, UrlHistoryManagerSymbol],
	scrollRestorationFactory
)
