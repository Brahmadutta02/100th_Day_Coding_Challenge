import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	SdkHandlersProvider,
	BrowserWindow,
	BrowserWindowSymbol,
	IAppWillMountHandler,
	IAppDidMountHandler,
	LoggerSymbol,
	ILogger,
} from '@wix/thunderbolt-symbols'
import { DashboardWixCodeSdkHandlers, ProxifiedDashboardApi } from '../types'
import { wrap, transfer, windowEndpoint, createEndpoint, Remote } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { callDashboardApiFactory } from './services/callDashboardApiFactory'
import { PopupProviderSymbol } from '../index'
import { IPopupApi } from './popupApiProvider'
import { name } from '../symbols'
import { init as initSDK, registerHeightReporter } from '@wix/dashboard-sdk/configurable'
import shouldExposeNewSdk from './services/shouldExposeNewSdk'
import getDashboardOrigin from './services/getDashboardOrigin'

const getDashboardApiFactory = (window: BrowserWindow) => {
	let dashboardApi: Remote<ProxifiedDashboardApi> | null = null

	return () => {
		if (!dashboardApi) {
			dashboardApi = wrap<ProxifiedDashboardApi>(windowEndpoint(window!.parent))
		}
		return dashboardApi
	}
}

export const dashboardWixCodeSdkHandlers = withDependencies(
	[BrowserWindowSymbol, PopupProviderSymbol, LoggerSymbol],
	(
		window: BrowserWindow,
		popupApiProvider: () => Promise<IPopupApi>,
		logger: ILogger
	): SdkHandlersProvider<DashboardWixCodeSdkHandlers> & IAppWillMountHandler & IAppDidMountHandler => {
		const getDashboardApi = getDashboardApiFactory(window)
		const isHostedInAnotherSite = window && window !== window.parent
		let disposeSDK: (() => Promise<void>) | null = null
		let unregisterHeightReporter: (() => void) | null = null
		return {
			getSdkHandlers: () => ({
				[name]: {
					getDashboardApi: async () => {
						/// "Lazy" loading so the sled test has an opportunity to highjack window.parent...
						const dashboardApi = getDashboardApi()
						const port = await dashboardApi[createEndpoint]()
						return transfer(port, [port])
					},
					postMessageParent: (message, targetOrigin, transferables) => {
						if (isHostedInAnotherSite) {
							window.parent.postMessage(message, targetOrigin, transferables)
						}
					},
					captureError: (e: Error) => {
						logger.captureError(e, {
							tags: { feature: 'feature-dashboard-wix-code-sdk' },
							extra: { origin: 'factory' },
						})
					},
				},
			}),

			async appWillMount() {
				const popupsApi = (await popupApiProvider()).getPopupsApi()
				if (popupsApi) {
					const dashboardApi = getDashboardApi()
					const callDashboardApi = callDashboardApiFactory(() => dashboardApi[createEndpoint]())
					popupsApi.registerToLightboxEvent('popupOpen', () => {
						callDashboardApi('openLightbox')
					})
					popupsApi.registerToLightboxEvent('popupClose', () => {
						callDashboardApi('closeLightbox')
					})
				}
			},

			async appDidMount() {
				try {
					if (isHostedInAnotherSite && shouldExposeNewSdk({ locationHref: window.location.href })) {
						unregisterHeightReporter && unregisterHeightReporter()
						disposeSDK && (await disposeSDK())

						disposeSDK = initSDK({
							origin: getDashboardOrigin(window.location.href) || '',
							postMessage: window.parent.postMessage.bind(window.parent),
						})

						unregisterHeightReporter = registerHeightReporter(
							window.document.querySelector<HTMLElement>('#SITE_CONTAINER')!
						)
					}
				} catch (e) {
					logger.captureError(e, {
						tags: { feature: 'feature-dashboard-wix-code-sdk' },
					})
					throw e
				}
			},
		}
	}
)
