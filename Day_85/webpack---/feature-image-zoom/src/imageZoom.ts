import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	Props,
	IPropsStore,
} from '@wix/thunderbolt-symbols'
import type { ImageZoomPageConfig, ImageZoomAPI } from './types'
import { name, ImageZoomAPISymbol, IMAGE_ZOOM_QUERY, IMAGE_ZOOM_ID, RUNTIME_DELIMETER } from './symbols'
import { IUrlChangeHandler, IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'

export const getZoomDataFromUrl = (
	propsStore: IPropsStore,
	urlHistoryManager: IUrlHistoryManager,
	imageDataItemIdToCompId: ImageZoomPageConfig['imageDataItemIdToCompId']
) => {
	const urlDataItem = urlHistoryManager.getParsedUrl().searchParams.get(IMAGE_ZOOM_QUERY)
	if (!urlDataItem) {
		return null
	}

	const zoomComp = propsStore.get(IMAGE_ZOOM_ID)
	const compId = urlDataItem.includes(RUNTIME_DELIMETER)
		? urlDataItem.split(RUNTIME_DELIMETER)[0]
		: imageDataItemIdToCompId[urlDataItem] || zoomComp?.compId
	return compId ? { dataItemId: urlDataItem!, compId } : null
}

export const ImageZoom = withDependencies(
	[named(PageFeatureConfigSymbol, name), Props, ImageZoomAPISymbol, UrlHistoryManagerSymbol],
	(
		{ imageDataItemIdToCompId }: ImageZoomPageConfig,
		propsStore: IPropsStore,
		zoomAPI: ImageZoomAPI,
		urlHistoryManager: IUrlHistoryManager
	): IPageDidMountHandler & IPageDidUnmountHandler & IUrlChangeHandler => {
		return {
			async onUrlChange() {
				const zoomInfo = getZoomDataFromUrl(propsStore, urlHistoryManager, imageDataItemIdToCompId)
				if (zoomInfo) {
					await zoomAPI.openImageZoom(zoomInfo.compId, zoomInfo.dataItemId)
				} else {
					zoomAPI.closeImageZoom()
				}
			},
			async pageDidMount() {
				const zoomInfo = getZoomDataFromUrl(propsStore, urlHistoryManager, imageDataItemIdToCompId)
				if (zoomInfo) {
					await zoomAPI.openImageZoom(zoomInfo.compId, zoomInfo.dataItemId)
				}
			},
			async pageDidUnmount() {
				zoomAPI.closeImageZoom()
			},
		}
	}
)
