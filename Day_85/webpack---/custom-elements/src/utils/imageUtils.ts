// @ts-nocheck

import { fittingTypes, alignTypes, getData } from '@wix/image-kit'

const getImageComputedProperties = (imageInfo, envConsts, htmlTag) => {
	const { targetWidth, targetHeight, imageData, filters, displayMode = fittingTypes.SCALE_TO_FILL } = imageInfo

	// todo: CLNT-5323 , wixapp sildergallery proxy is generating image data without uri
	if (!targetWidth || !targetHeight || !imageData.uri) {
		return { uri: '', css: {} }
	}

	const {
		width,
		height,
		crop,
		name,
		focalPoint,
		upscaleMethod,
		quality,
		devicePixelRatio = envConsts.devicePixelRatio,
	} = imageData
	const imageOptions = {
		filters,
		upscaleMethod,
		...quality,
	}

	const pixelAspectRatio = getDevicePixelRatio(devicePixelRatio)

	const src = {
		id: imageData.uri,
		width,
		height,
		...(crop && { crop }), // eslint-disable-line no-extra-parens
		...(focalPoint && { focalPoint }), // eslint-disable-line no-extra-parens
		...(name && { name }), // eslint-disable-line no-extra-parens
	}

	const target = {
		width: targetWidth,
		height: targetHeight,
		htmlTag: htmlTag || 'img',
		pixelAspectRatio,
		alignment: imageInfo.alignType || alignTypes.CENTER,
	}

	const imageComputedProperties = getData(displayMode, src, target, imageOptions)
	imageComputedProperties.uri = getMediaUrlByContext(
		imageComputedProperties.uri,
		envConsts.staticMediaUrl,
		envConsts.mediaRootUrl
	)
	return imageComputedProperties
}

const getMediaUrlByContext = (imageUri, staticMediaUrl, mediaRootUrl) => {
	const isExternalUrl = /(^https?)|(^data)|(^blob)|(^\/\/)/.test(imageUri)
	if (isExternalUrl) {
		return imageUri
	}
	let path = `${staticMediaUrl}/`
	if (imageUri) {
		if (/^micons\//.test(imageUri)) {
			path = mediaRootUrl
		} else if (/[^.]+$/.exec(imageUri)[0] === 'ico') {
			// if the image is an icon then it's taken from a slightly different place
			path = path.replace('media', 'ficons')
		}
	}
	return path + imageUri
}

const getDevicePixelRatio = (devicePixelRatio) => {
	// we should be able to force devicePixelRatio from url by using the query param -
	const queryParams = window.location.search.split('&').map((query) => query.split('='))
	const devicePixelRatioQueryParam = queryParams.find((query) => query[0].toLowerCase().includes('devicepixelratio'))
	const devicePixelRatioValueForceFromUrl = devicePixelRatioQueryParam ? Number(devicePixelRatioQueryParam[1]) : null
	return devicePixelRatioValueForceFromUrl || devicePixelRatio || 1
}

const getImageSrc = (imageNode, isSvgImage) => imageNode.getAttribute(isSvgImage ? 'xlink:href' : 'src')

function getMaskBBox(svgNode) {
	if (svgNode) {
		const { type } = svgNode.dataset

		if (type && type !== 'ugc') {
			const dataBBox = svgNode.dataset.bbox

			if (!dataBBox) {
				const { x, y, width, height } = svgNode.getBBox()

				return `${x} ${y} ${width} ${height}`
			}
		}
	}

	return null
}

// todo: temp experiments for measuring purposes, should be removed after test results
function shouldStopImageLoad(services) {
	return (
		services.isExperimentOpen('specs.thunderbolt.tb_stop_client_images') ||
		services.isExperimentOpen('specs.thunderbolt.final_force_webp') ||
		services.isExperimentOpen('specs.thunderbolt.final_force_no_webp')
	)
}

export { shouldStopImageLoad, getImageComputedProperties, getImageSrc, getMaskBBox }
