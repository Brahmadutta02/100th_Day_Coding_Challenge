import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IAppDidLoadPageHandler,
	CurrentRouteInfoSymbol,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import type { ScrollToAnchorPageConfig } from './types'
import { name } from './symbols'
import { WindowScrollApiSymbol, IWindowScrollAPI } from 'feature-window-scroll'
import { ICurrentRouteInfo } from 'feature-router'
import { TOP_AND_BOTTOM_ANCHORS, TOP_ANCHOR } from './constants'
import { ILightboxUtils, LightboxUtilsSymbol } from 'feature-lightbox'

const postNavigationScrollFactory = (
	{ nicknameToCompIdMap, anchorDataIdToCompIdMap }: ScrollToAnchorPageConfig,
	routeInfo: ICurrentRouteInfo,
	windowScrollApi: IWindowScrollAPI,
	experiments: Experiments,
	popupUtils?: ILightboxUtils
): IAppDidLoadPageHandler => {
	return {
		appDidLoadPage: ({ pageId }) => {
			const currentRouteInfo = routeInfo.getCurrentRouteInfo()
			if (popupUtils?.isLightbox(pageId) || !currentRouteInfo) {
				return
			}

			const { anchorDataId, parsedUrl } = currentRouteInfo
			if (anchorDataId) {
				// Normally the browser scrolls by itself to anchors when it
				// sees hash in the URL. in our single page application
				// the url changes to contain the hash before the anchor with
				// that id is rendered, so we need to perform the scroll ourselves
				const isHashAnchor = parsedUrl.hash.endsWith(anchorDataId)

				const isTopBottomAnchor = TOP_AND_BOTTOM_ANCHORS.includes(anchorDataId)

				const compId =
					isTopBottomAnchor || isHashAnchor
						? anchorDataId
						: anchorDataIdToCompIdMap[anchorDataId] || nicknameToCompIdMap[anchorDataId]
				const skipScrollAnimation = anchorDataId === TOP_ANCHOR

				windowScrollApi.scrollToComponent(compId, { callbacks: undefined, skipScrollAnimation })
			}
		},
	}
}

export const PostNavigationScroll = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		CurrentRouteInfoSymbol,
		WindowScrollApiSymbol,
		ExperimentsSymbol,
		optional(LightboxUtilsSymbol),
	],
	postNavigationScrollFactory
)
