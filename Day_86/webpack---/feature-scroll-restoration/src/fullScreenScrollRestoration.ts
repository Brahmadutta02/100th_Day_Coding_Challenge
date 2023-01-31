import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, IAppDidMountHandler } from '@wix/thunderbolt-symbols'
import { isChrome, isSSR } from '@wix/thunderbolt-commons'

const fullScreenScrollRestorationFactory = (browserWindow: BrowserWindow): IAppDidMountHandler => {
	return {
		appDidMount() {
			if (!isSSR(browserWindow) && isChrome(browserWindow)) {
				let lastActiveFullScreenElement: Element | null = null

				browserWindow.document.addEventListener('fullscreenchange', () => {
					const fullscreenElement = browserWindow.document.fullscreenElement
					// capture full screen element when entering full screen mode
					if (fullscreenElement) {
						lastActiveFullScreenElement = fullscreenElement
						return
					}

					// full screen element is null when exiting full screen mode, restore scroll position
					if (lastActiveFullScreenElement) {
						lastActiveFullScreenElement.scrollIntoView()
					}
				})
			}
		},
	}
}

export const FullScreenScrollRestoration = withDependencies([BrowserWindowSymbol], fullScreenScrollRestorationFactory)
