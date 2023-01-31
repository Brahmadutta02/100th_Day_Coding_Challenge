import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IAnchorCompIdProvider, IScrollToAnchorHandlerProvider } from './types'
import { AnchorCompIdProviderSymbol } from './symbols'
import { TOP_AND_BOTTOM_ANCHORS } from './constants'
import { IWindowScrollAPI, WindowScrollApiSymbol } from 'feature-window-scroll'
import { Structure, IStructureStore, BrowserWindowSymbol, BrowserWindow } from '@wix/thunderbolt-symbols'

const scrollToAnchorHandlerProviderFactory = (
	{ getAnchorCompId }: IAnchorCompIdProvider,
	browserWindow: BrowserWindow,
	windowScrollApi: IWindowScrollAPI,
	structureStore: IStructureStore
): IScrollToAnchorHandlerProvider => {
	return {
		getHandler: () => (anchorData) => {
			const anchorDataId = anchorData.anchorDataId ?? ''
			const anchorCompId = anchorData.anchorCompId ?? ''

			const isTopBottomAnchor = TOP_AND_BOTTOM_ANCHORS.includes(anchorDataId)
			if (isTopBottomAnchor) {
				windowScrollApi.scrollToComponent(anchorDataId)
				return true
			}

			const isStructureCompAnchor = structureStore.get(anchorCompId)
			const isHashAnchor = browserWindow!.document.getElementById(anchorCompId)
			if (isStructureCompAnchor || isHashAnchor) {
				windowScrollApi.scrollToComponent(anchorCompId)
				return true
			}

			const anchorCompIdFromDataId = getAnchorCompId(anchorDataId) || ''
			if (structureStore.get(anchorCompIdFromDataId)) {
				// in responsive the anchorData doesn't include the comp id
				windowScrollApi.scrollToComponent(anchorCompIdFromDataId)
				return true
			}

			return false
		},
	}
}

export const ScrollToAnchorHandlerProvider = withDependencies(
	[AnchorCompIdProviderSymbol, BrowserWindowSymbol, WindowScrollApiSymbol, Structure],
	scrollToAnchorHandlerProviderFactory
)
