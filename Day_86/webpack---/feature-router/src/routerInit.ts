import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	ViewerModelSym,
	ViewerModel,
	IAppWillMountHandler,
	BrowserWindow,
	BrowserWindowSymbol,
	LoggerSymbol,
	ILogger,
} from '@wix/thunderbolt-symbols'
import { Router as RouterSymbol } from './symbols'
import type { IUrlHistoryPopStateHandler, IRouter } from './types'
import { isSSR } from '@wix/thunderbolt-commons'
import { getUrlHash } from './urlUtils'

export const RouterInitAppWillMount = withDependencies(
	[RouterSymbol, ViewerModelSym, BrowserWindowSymbol, LoggerSymbol],
	(router: IRouter, viewerModel: ViewerModel, window: BrowserWindow, logger: ILogger): IAppWillMountHandler => ({
		appWillMount: async () => {
			const url = getInitialNavigationUrl(window, viewerModel)
			const hashAnchor = getUrlHash(url)
			const navigationParams = hashAnchor ? { anchorDataId: hashAnchor } : {}

			logger.phaseStarted(`router_navigate`)
			await router.navigate(url, navigationParams)
			logger.phaseEnded(`router_navigate`)
		},
	})
)

export const RouterInitOnPopState = withDependencies(
	[RouterSymbol],
	(router: IRouter): IUrlHistoryPopStateHandler => ({
		onPopState: async (url) => {
			await router.navigate(url.href)
		},
	})
)

const getInitialNavigationUrl = (window: BrowserWindow, viewerModel: ViewerModel) => {
	if (isSSR(window)) {
		return viewerModel.requestUrl
	}

	// When the site is being viewed in Google Translate (e.g: https://ssrdev-wixsite-com.translate.goog/button-wixcode?_x_tr_sl=en&_x_tr_tl=iw&_x_tr_hl=en-US)
	// Or Google cached copy (e.g: https://webcache.googleusercontent.com/search?q=cache:cqru0HcBGaEJ:https://www.wix.com/+&cd=1&hl=en&ct=clnk&gl=il)
	if (
		window.location.host.includes('translate.goog') ||
		window.location.host.includes('webcache.googleusercontent.com')
	) {
		return viewerModel.requestUrl
	}

	// In the browser we take the URL from the address bar in order to support hash
	return window.location.href
}
