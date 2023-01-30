import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export type MessageData = {
	x: number
	y: number
}

export const ScrollByHandler = withDependencies(
	[BrowserWindowSymbol],
	(window: BrowserWindow): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				scrollBy(compId, { x, y }: MessageData) {
					window!.scrollBy(x, y)
				},
			}
		},
	})
)
