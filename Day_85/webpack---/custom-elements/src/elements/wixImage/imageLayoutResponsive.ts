// @ts-nocheck

import { getDocumentScrollPosition, getScreenHeight, setAttributes, setCssVars, setStyle } from '../../utils/domUtils'
import { getImageComputedProperties, getImageSrc } from '../../utils/imageUtils'
import { get } from '../../utils/utils'

// ImageX component uses cssVars for scrollEffect calculation.
// Values for some of these vars are set here
const COMP_HEIGHT_CSS_VAR = '--compH'
const COMP_TOP_CSS_VAR = '--top'
const SCROLL_CSS_VAR = '--scroll'

function getContainerStyle(opacity) {
	const style = {}
	if (typeof opacity === 'number') {
		style.opacity = opacity
	}
	return style
}

function getScrollEffectCssVars(measures) {
	return {
		[COMP_HEIGHT_CSS_VAR]: measures.height,
		[COMP_TOP_CSS_VAR]: Math.ceil(measures.boundingRect.top) + measures.documentScroll,
		[SCROLL_CSS_VAR]: measures.documentScroll,
	}
}

function needScrollEffectCssVars(defaultScrollEffect, sourceSets = []) {
	const hasParallax =
		defaultScrollEffect === 'parallax' || sourceSets.some((sourceSet) => sourceSet.scrollEffect === 'parallax')
	return hasParallax
}

function getImageHeight(measures, scrollEffect, parallaxSpeed = 1.5) {
	const heightForScrollEffect = {
		parallax: measures.height * parallaxSpeed,
		fixed: measures.screenHeight,
	}
	return heightForScrollEffect[scrollEffect] || measures.height
}

function getImageStyle(imageComputedProperties) {
	const imageCss = get(imageComputedProperties, ['css', 'img'])
	const objectFit = imageCss ? imageCss.objectFit : undefined
	// do not set height, it would be set by css selector from outside
	return {
		width: '100%', // TODO: maybe should not be here, as height, set outside
		objectFit,
	}
}

function computeSourceSets(measures, imageInfo, envConsts, pictureNode) {
	const { sourceSets } = imageInfo
	if (!sourceSets || !sourceSets.length) {
		return
	}
	const imageInfoClone = JSON.parse(JSON.stringify(imageInfo))
	const { parallaxSpeed } = imageInfoClone
	sourceSets.forEach((sourceSet) => {
		const sourceNode = pictureNode.querySelector(`source[media='${sourceSet.mediaQuery}']`)
		imageInfoClone.imageData.crop = sourceSet.crop
		imageInfoClone.imageData.displayMode = sourceSet.displayMode
		imageInfoClone.imageData.focalPoint = sourceSet.focalPoint
		imageInfoClone.targetHeight = getImageHeight(measures, sourceSet.scrollEffect, parallaxSpeed)
		const imageComputedProperties = getImageComputedProperties(imageInfoClone, envConsts, 'img')
		setAttributes(sourceNode, { 'data-srcset': get(imageComputedProperties, 'uri') })
	})
}

function measure(id, measures, domNodes) {
	const imageNode = domNodes.image
	if (!imageNode) {
		return
	}

	const imgSrc = getImageSrc(imageNode)

	measures.width = domNodes[id].offsetWidth
	measures.height = domNodes[id].offsetHeight
	measures.imgSrc = imgSrc
	measures.screenHeight = getScreenHeight()
	measures.boundingRect = domNodes[id].getBoundingClientRect()
	measures.documentScroll = getDocumentScrollPosition()
}

function patch(id, measures, domNodes, imageInfo, services, envConsts, loadImage) {
	const { imageData, parallaxSpeed } = imageInfo

	const extendedImageInfo = {
		...imageInfo,
		targetWidth: measures.width,
		targetHeight: getImageHeight(measures, imageData.scrollEffect, parallaxSpeed),
		displayMode: imageData.displayMode,
	}

	const containerStyle = getContainerStyle(imageData.opacity)
	setStyle(domNodes[id], containerStyle)

	const imageComputedProperties = getImageComputedProperties(extendedImageInfo, envConsts, 'img')
	const src = get(imageComputedProperties, 'uri')
	setAttributes(domNodes[id], { 'data-src': src })

	const needCssVars = needScrollEffectCssVars(imageData.scrollEffect, imageInfo.sourceSets)
	if (needCssVars) {
		// wixui.ImageX implements scroll effects by css variables. provide their values here
		setCssVars(domNodes[id], getScrollEffectCssVars(measures))
	}

	const imageStyle = getImageStyle(imageComputedProperties)
	setStyle(domNodes.image, imageStyle)

	if (domNodes.picture) {
		computeSourceSets(measures, extendedImageInfo, envConsts, domNodes.picture)
	}

	// clear initial indication that the image src came from first render (e.g. SSR)
	setAttributes(domNodes[id], { 'data-has-ssr-src': '' })

	if (loadImage) {
		services.imageLoader.loadImage(domNodes[id], {
			screenHeight: measures.screenHeight,
			boundingRect: measures.boundingRect,
			withScrollEffectVars: needCssVars,
		})
	}
}

export default {
	measure,
	patch,
}
