import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IPreviewTooltipCallback, PreviewTooltipState } from './types'
import type { PreviewTooltipCallbackFn } from '@wix/thunderbolt-becky-types'

const previewTooltipCallback = (): IPreviewTooltipCallback => {
	const state: PreviewTooltipState = {
		callback: () => {},
	}

	return {
		getPreviewTooltipCallback: () => state.callback,
		setPreviewTooltipCallback: (callback: PreviewTooltipCallbackFn) => {
			state.callback = callback
		},
	}
}

export const PreviewTooltipCallback = withDependencies([], previewTooltipCallback)
