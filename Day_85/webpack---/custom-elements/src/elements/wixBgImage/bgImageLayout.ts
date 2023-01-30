// @ts-nocheck

import { getImageComputedProperties } from '../../utils/imageUtils'
import { setStyle, getScreenHeight } from '../../utils/domUtils'

function didImageChange(currentImageUrlCss = '', newUrl) {
	return !currentImageUrlCss.includes(newUrl) || !!currentImageUrlCss !== !!newUrl
}

const init = (contextWindow = window) => {
	function setBackground(domNode, imageTransformData) {
		const elementStyleAndUrl = {
			backgroundImage: `url("${imageTransformData.uri}")`,
			...imageTransformData.css.container,
		}
		const image = new contextWindow.Image()

		image.onload = setStyle.bind(null, domNode, elementStyleAndUrl)
		image.src = imageTransformData.uri
	}

	function measure(id, measures, domNodes, { containerId, bgEffectName }, services) {
		const bgImage = domNodes[id]
		const container = domNodes[containerId]
		const { width, height } = services.getMediaDimensionsByEffect(
			bgEffectName,
			container.offsetWidth,
			container.offsetHeight,
			getScreenHeight(services.getScreenHeightOverride)
		)

		measures.width = width
		measures.height = height
		measures.currentSrc = bgImage.style.backgroundImage
		measures.bgEffectName = bgImage.dataset.bgEffectName
	}

	function patch(id, measures, domNodes, imageInfo, envConsts) {
		const bgImage = domNodes[id]
		imageInfo.targetWidth = measures.width
		imageInfo.targetHeight = measures.height
		const imageTransformData = getImageComputedProperties(imageInfo, envConsts, 'bg')

		if (didImageChange(measures.currentSrc, imageTransformData.uri)) {
			setBackground(bgImage, imageTransformData)
		} else {
			setStyle(bgImage, imageTransformData.css.container)
		}
	}

	return {
		measure,
		patch,
	}
}

export { init }
