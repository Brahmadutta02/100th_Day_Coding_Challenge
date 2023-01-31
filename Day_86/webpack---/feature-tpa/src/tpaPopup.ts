import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, IPageDidMountHandler, ITpaPopup } from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { TpaPopupApiSymbol } from './symbols'
import { createPromise, isSSR } from '@wix/thunderbolt-commons'

export const TpaPopupFactory = withDependencies(
	[TpaPopupApiSymbol, SessionManagerSymbol, BrowserWindowSymbol],
	(tpaPopupApi: ITpaPopup, sessionManager: ISessionManager, window: Window): ITpaPopup & IPageDidMountHandler => {
		const { resolver: pageDidMountResolver, promise: pageDidMountPromise } = createPromise()

		return {
			...tpaPopupApi,
			pageDidMount() {
				pageDidMountResolver()
				const unregister = sessionManager.addLoadNewSessionCallback(tpaPopupApi.refreshAllPopups)
				return () => {
					unregister()
					tpaPopupApi.closeNonPersistentPopups()
				}
			},
			async openPopup(...args) {
				if (isSSR(window)) {
					// do not open popups in ssr even if requested from an OOI/wixCode
					return
				}
				await pageDidMountPromise
				return tpaPopupApi.openPopup(...args)
			},
		}
	}
)
