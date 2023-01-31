import { IPropsStore, IStructureAPI } from '@wix/thunderbolt-symbols'
import { IMAGE_ZOOM_QUERY, IMAGE_ZOOM_ID, RUNTIME_DELIMETER } from './symbols'
import type { ImageZoomAPIConfig, ImageZoomAPI, ImageZoomGalleryProps, ImageZoomItem } from './types'
import { ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IUrlHistoryManager } from 'feature-router'
import {
	TpaGalleryProps,
	Image,
	GalleryItem,
	NativeGalleryProps,
	OpenImageZoomGalleryHandler,
} from '@wix/thunderbolt-components-native'

export const ImageZoomAPIImpl = (
	imageZoomConfig: ImageZoomAPIConfig,
	propsStore: IPropsStore,
	structureAPI: IStructureAPI,
	siteScrollBlocker: ISiteScrollBlocker,
	urlHistoryManager: IUrlHistoryManager
): ImageZoomAPI => {
	const addWPhotoOnClick = (compId: string) => {
		const dataItem = imageZoomConfig.wPhotoConfig[compId]
		// Platform added onClick, do nothing
		if (!dataItem || propsStore.get(compId).onClick) {
			return
		}
		const onClickOpenZoom = async (e: Event) => {
			// @ts-ignore
			const runTimeCompId = e.currentTarget!.id || compId
			const runtimeProps = propsStore.get(runTimeCompId)
			const props = { ...propsStore.get(compId), ...runtimeProps }
			if (props.onClickBehavior !== 'zoomMode') {
				return
			}

			const runTimeDataItemId =
				runtimeProps && runTimeCompId !== compId ? `${runTimeCompId}${RUNTIME_DELIMETER}${dataItem}` : dataItem
			// TODO Or Granit 13/05/2020: can remove these 2 lines when TB-416 implemented
			e.preventDefault()
			e.stopPropagation()
			await openImageZoom(runTimeCompId, runTimeDataItemId)
		}

		propsStore.update({ [compId]: { onClick: onClickOpenZoom } })
	}

	const addNativeGalleryOnClick = (compId: string) => {
		const onClickOpenZoom: OpenImageZoomGalleryHandler = async (dataItem, runTimeCompId, onCloseCB?) => {
			await openImageZoom(runTimeCompId, dataItem, onCloseCB)
		}

		propsStore.update({ [compId]: { openImageZoom: onClickOpenZoom } })
	}
	const setZoomDataToUrl = (dataItemId: string | null) => {
		const url = urlHistoryManager.getParsedUrl()
		if (dataItemId) {
			url.searchParams.set(IMAGE_ZOOM_QUERY, dataItemId)
		} else {
			url.searchParams.delete(IMAGE_ZOOM_QUERY)
		}
		urlHistoryManager.pushUrlState(url)
	}

	const addComponent = async (imageZoomProps: ImageZoomGalleryProps) => {
		propsStore.update({ [IMAGE_ZOOM_ID]: imageZoomProps })
		await structureAPI.addComponentToDynamicStructure(IMAGE_ZOOM_ID, {
			componentType: imageZoomConfig.imageZoomCompType,
			components: [],
		})
		siteScrollBlocker.setSiteScrollingBlocked(true, IMAGE_ZOOM_ID)
	}
	const removeComponent = () => {
		if (!structureAPI.isComponentInDynamicStructure(IMAGE_ZOOM_ID)) {
			return
		}
		structureAPI.removeComponentFromDynamicStructure(IMAGE_ZOOM_ID)
		siteScrollBlocker.setSiteScrollingBlocked(false, IMAGE_ZOOM_ID)
	}

	const closeImageZoom = () => {
		if (!structureAPI.isComponentInDynamicStructure(IMAGE_ZOOM_ID)) {
			return
		}
		removeComponent()

		setZoomDataToUrl(null)
	}
	const onImageChange = (dataItemId: string) => {
		setZoomDataToUrl(dataItemId)
	}

	const convertTpaGalleryImagesToImageZoomFormat = (compProps: TpaGalleryProps, compId: string) => {
		// @ts-ignore
		return compProps.images.map((image: Image) => convertImagePropsToImageZoomFormat(image, compId))
	}

	const convertNativeGalleryImagesToImageZoomFormat = (items: NativeGalleryProps['items']) => {
		return items.map(({ image, dataId, ...rest }: GalleryItem) =>
			convertImagePropsToImageZoomFormat({ id: dataId, ...image, ...rest })
		)
	}

	const convertImagePropsToImageZoomFormat = (image: any, containerId?: string): ImageZoomItem => {
		const isMobile = imageZoomConfig.deviceType === 'Smartphone'
		const {
			id,
			uri,
			alt,
			width,
			height,
			href,
			link,
			title,
			description,
			crop,
			quality,
			filterEffectSvgString,
			filterEffectSvgUrl,
		} = image
		// When there's no `link` in WPhoto the `link` value is { href: undefined } which is something we don't want to pass EE
		const filteredLink = link?.href || link?.linkPopupId ? { link } : {}
		const linkProp = href ? { link: { ...link, href } } : filteredLink
		return {
			id,
			containerId,
			uri,
			alt,
			name: image.name,
			width,
			height,
			title,
			quality,
			description,
			filterEffectSvgString,
			filterEffectSvgUrl,
			...linkProp,
			...(!isMobile && { crop }),
		}
	}

	const openImageZoom = async (compId: string, dataItemId: string, onCloseCB?: () => void) => {
		const [templateId] = compId.split('__')
		const compProps = { ...propsStore.get(templateId), ...propsStore.get(compId) } as any
		if (structureAPI.isComponentInDynamicStructure(IMAGE_ZOOM_ID)) {
			return
		}

		// compId is either of a gallery or a wPhoto
		const isTpaGallery = imageZoomConfig.tpaGalleriesComps.hasOwnProperty(templateId)
		const isNativeGallery = imageZoomConfig.nativeGalleriesComps.hasOwnProperty(templateId)

		let images
		if (isTpaGallery) {
			images = convertTpaGalleryImagesToImageZoomFormat(compProps, compId)
		} else if (isNativeGallery) {
			images = convertNativeGalleryImagesToImageZoomFormat(compProps.items)
		} else {
			images = [convertImagePropsToImageZoomFormat(compProps, compId)]
		}

		const imageZoomProps: ImageZoomGalleryProps = {
			images,
			onClose: () => {
				closeImageZoom()
				onCloseCB && onCloseCB()
			},
			onImageChange,
			dataItemId,
			compId,
			deviceType: imageZoomConfig.deviceType,
		}
		await addComponent(imageZoomProps)

		if (imageZoomConfig.shouldChangeUrl) {
			setZoomDataToUrl(dataItemId)
		}
	}

	return {
		openImageZoom,
		closeImageZoom,
		addWPhotoOnClick,
		addNativeGalleryOnClick,
	}
}
