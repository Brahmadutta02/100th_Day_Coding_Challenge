import { withDependencies } from '@wix/thunderbolt-ioc'
import { ITpaFullScreenMode } from '../types'
import { TpaFullScreenModeSymbol } from '../symbols'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export type MessageData = {
	isFullScreen: boolean
}

export const SetFullScreenMobileHandler = withDependencies(
	[TpaFullScreenModeSymbol],
	(fullScreenMode: ITpaFullScreenMode): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async setFullScreenMobile(compId: string, { isFullScreen }: MessageData) {
					fullScreenMode.setFullScreenMobile(compId, isFullScreen)
				},
			}
		},
	})
)
