import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export type HandlerResponse = {
	top?: {
		height: number
		width: number
		top: number
		left: number
	}
}

export const GetAdsOnPageHandler = withDependencies(
	[BrowserWindowSymbol],
	(window: BrowserWindow): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getAdsOnPage(): HandlerResponse {
					const wixAdsElement = window!.document.getElementById('WIX_ADS')
					if (!wixAdsElement) {
						return {}
					}

					const { height, width, x, y } = wixAdsElement.getBoundingClientRect()
					return {
						top: {
							height,
							width,
							top: y,
							left: x,
						},
					}
				},
			}
		},
	})
)
