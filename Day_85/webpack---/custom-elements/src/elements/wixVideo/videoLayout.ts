// @ts-nocheck

import { joinURL, unique } from '../../utils/utils'
import { setStyle, fittingTypeToObjectFit } from '../../utils/domUtils'
import { fittingTypes } from '@wix/image-kit'

export default {
	/**
	 * @param {HTMLVideoElement} videoNode
	 * @param {HTMLDivElement} container
	 * @param {boolean} hasBgScrollEffect
	 * @param {number} videoWidth
	 * @param {number} videoHeight
	 * @param {string} fittingType
	 * @param {string} alignType
	 * @param {Object[]} qualities
	 * @param {string} staticVideoUrl
	 * @param {string} videoId
	 * @param {string} videoFormat
	 * @param {{x: number, y:number}} focalPoint
	 * @return {{currentSrc: string, videoStyle: {top: number, left: number, width: number, height: number}, videoSourceUrl: string}}
	 */
	measure(
		videoNode,
		container,
		{
			hasBgScrollEffect,
			videoWidth,
			videoHeight,
			fittingType,
			alignType = 'center',
			qualities,
			staticVideoUrl,
			videoId,
			videoFormat,
			focalPoint,
		}
	) {
		// if background has a full-height scroll effect we use the parent width,
		// the element position is fixed and without explicit width it will take
		// the viewport's width or the width of an ancestor with a transform (i.e. page in transition)
		const width = hasBgScrollEffect ? container.offsetWidth : videoNode.parentElement.offsetWidth
		const height = videoNode.parentElement.offsetHeight
		const vidWidth = parseInt(videoWidth, 10)
		const vidHeight = parseInt(videoHeight, 10)
		const scaleFactor = getScaleFactor(width, height, vidWidth, vidHeight)
		const videoScaledDimensions = getVideoDimension(fittingType, scaleFactor, vidWidth, vidHeight)
		const targetQuality = getVideoQualityBySize(qualities, videoScaledDimensions)

		const videoSourceUrl = getMP4Url(targetQuality, staticVideoUrl, videoId, videoFormat)
		const needsSrcUpdate = shouldUpdateSrc(videoNode, videoSourceUrl)
		const objectFit = fittingTypeToObjectFit[fittingType] || 'cover'
		const focalPosition = focalPoint
			? convertFillFocalToPosition(videoScaledDimensions, { width, height }, focalPoint)
			: ''
		const alignTypeString = alignType.replace('_', ' ')
		return {
			videoSourceUrl,
			needsSrcUpdate,
			videoStyle: {
				height: '100%',
				width: '100%',
				objectFit,
				objectPosition: focalPosition ? focalPosition : alignTypeString,
			},
		}
	},
	/**
	 * @param {HTMLDivElement} poster
	 * @param {HTMLCanvasElement|null} canvas
	 * @param {HTMLVideoElement} videoNode
	 * @param {Object} videoStyle
	 * @param {boolean} autoPlay
	 * @param {string} videoSourceUrl
	 * @param {boolean} needsSrcUpdate
	 * @param {string} animatePoster
	 * @param {string} videoFormat
	 * @param {number} playbackRate
	 * @param {boolean} isEditorMode
	 */
	mutate(
		poster,
		canvas,
		videoNode,
		videoStyle,
		autoPlay,
		videoSourceUrl,
		needsSrcUpdate,
		animatePoster,
		videoFormat,
		playbackRate,
		isEditorMode
	) {
		if (canvas) {
			setStyle(canvas, videoStyle)
		} else {
			handlePosterVisibility(needsSrcUpdate, videoNode, poster, animatePoster, autoPlay, isEditorMode)

			if (autoPlay) {
				videoNode.setAttribute('autoplay', '')
			} else {
				videoNode.removeAttribute('autoplay')
			}

			setStyle(videoNode, videoStyle)
		}

		patchVideoSource(needsSrcUpdate, videoNode, videoSourceUrl)
		videoNode.playbackRate = playbackRate
	},
}

/**
 *
 * @param videoNode
 * @param newSrcUrl
 * @returns {*|boolean}
 */
function shouldUpdateSrc(videoNode, newSrcUrl) {
	const hasError = videoNode.networkState === videoNode.NETWORK_NO_SOURCE
	const hasDiff = !videoNode.currentSrc.endsWith(newSrcUrl)
	return newSrcUrl && (hasDiff || hasError)
}

/**
 * Calculate width and height of video's
 * visible rect according to provided `fittingType`.
 *
 * @param {string} fittingType
 * @param {{wScale: number, hScale: number}} videoScale
 * @param {number} videoWidth
 * @param {number} videoHeight
 * @return {{width: number, height: number}}
 */
function getVideoDimension(fittingType, videoScale, videoWidth, videoHeight) {
	let scale

	if (fittingType === fittingTypes.SCALE_TO_FIT) {
		scale = Math.min(videoScale.wScale, videoScale.hScale)
	} else {
		// default: fittingTypes.SCALE_TO_FILL
		scale = Math.max(videoScale.wScale, videoScale.hScale)
	}

	return {
		width: Math.round(videoWidth * scale),
		height: Math.round(videoHeight * scale),
	}
}

/**
 * Calculate ratio between video's width and height, and its container's.
 *
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @param {number} videoWidth
 * @param {number} videoHeight
 * @return {{wScale: number, hScale: number}}
 */
function getScaleFactor(containerWidth, containerHeight, videoWidth, videoHeight) {
	return {
		wScale: containerWidth / videoWidth,
		hScale: containerHeight / videoHeight,
	}
}

/**
 * Pick the desired video quality from a list of given qualities
 * according to visible rect dimensions.
 *
 * @param {Object[]} qualities
 * @param {{width: number, height: number}} videoScaledDimensions
 * @return {Object} the quality to use
 */
function getVideoQualityBySize(qualities, { width, height }) {
	const uniqueQualities = unique(qualities, (item) => item.size)
	const targetQuality = uniqueQualities.find((value) => value.size > width * height)

	return targetQuality || qualities[qualities.length - 1]
}

/**
 * Get a full URL for the video if playing MP4 format, or empty string otherwise.
 *
 * @param {Object} targetQuality
 * @param {string} staticVideoUrl
 * @param {string} videoId
 * @param {string} videoFormat
 * @returns {string}
 */
function getMP4Url(targetQuality, staticVideoUrl, videoId, videoFormat) {
	if (videoFormat === 'mp4') {
		// prefer video URL from new design data structure
		if (targetQuality.url) {
			return joinURL(staticVideoUrl, targetQuality.url)
		}
		// build URL from videoId
		return joinURL(staticVideoUrl, videoId, targetQuality.quality, videoFormat, 'file.mp4')
	}

	return ''
}

/**
 *
 * @param {boolean} needsEventUpdate
 * @param {HTMLVideoElement} videoNode
 * @param {HTMLDivElement} posterNode
 * @param {string} animatePoster
 * @param {boolean} autoplay
 * @param {boolean} isEditorMode
 */
function handlePosterVisibility(needsEventUpdate, videoNode, posterNode, animatePoster, autoplay, isEditorMode) {
	// todo: (preview -> Editor case) move to editor layout hooks
	// bring back the poster (preview -> Editor case)
	if (isEditorMode && videoNode.paused) {
		posterNode.style.opacity = '1'
		videoNode.style.opacity = '0'
	}
	// todo: (preview -> Editor case) move to editor layout hooks
	// register to events when updating src or when in Editor(preview -> Editor case)
	const isPausedOrEmpty = videoNode.paused || videoNode.currentSrc === ''
	const needsEventUpdateWithEditor = needsEventUpdate || isEditorMode
	if (needsEventUpdateWithEditor && isPausedOrEmpty) {
		videoNode.ontimeupdate = null
		videoNode.onseeked = null
		videoNode.onplay = null
		if (!isEditorMode && autoplay) {
			const muteState = videoNode.muted
			videoNode.muted = true
			// sync the poster removal with video first frame
			videoNode.ontimeupdate = () => {
				if (videoNode.currentTime > 0) {
					videoNode.ontimeupdate = null
					videoNode.onseeked = () => {
						videoNode.onseeked = null
						videoNode.muted = muteState
						removePoster(videoNode, posterNode, animatePoster)
					}
					videoNode.currentTime = 0
				}
			}
		} else {
			videoNode.onplay = () => {
				videoNode.onplay = null
				removePoster(videoNode, posterNode, animatePoster)
			}
		}
	}
}

/**
 * Load the video if needed.
 *
 * @param {boolean} needsSrcUpdate
 * @param {HTMLVideoElement} videoNode
 * @param {string} newSrc
 */
function patchVideoSource(needsSrcUpdate, videoNode, newSrc) {
	if (needsSrcUpdate) {
		videoNode.src = newSrc
		videoNode.load()
	}
}

/**
 * Show video , hide poster
 *
 * @param videoNode
 * @param posterNode
 * @param animatePoster
 */
function removePoster(videoNode, posterNode, animatePoster) {
	if (animatePoster === 'fade') {
		posterNode.style.transition = 'opacity 1.6s ease-out'
	}
	posterNode.style.opacity = '0'
	videoNode.style.opacity = '1'
}

/**
 *
 * @param {{width: number, height: number}} src source dimensions
 * @param {{width: number, height: number}} target target dimensions
 * @param {{x: number, y: number}} focalPoint x/y as 0-100 percentages
 * @returns {string} in 'x% y%' format
 */
function convertFillFocalToPosition(src, target, focalPoint) {
	const { width: sW, height: sH } = src
	const { width: tW, height: tH } = target
	const { x: fpX, y: fpY } = focalPoint

	if (!tW || !tH) {
		return `${fpX}% ${fpY}%`
	}

	const fillScaleFactor = Math.max(tW / sW, tH / sH)

	const imgScaledW = sW * fillScaleFactor
	const imgScaledH = sH * fillScaleFactor

	const x = Math.max(0, Math.min(imgScaledW - tW, imgScaledW * (fpX / 100) - tW / 2))
	const y = Math.max(0, Math.min(imgScaledH - tH, imgScaledH * (fpY / 100) - tH / 2))

	const posX = x && Math.floor((x / (imgScaledW - tW)) * 100)
	const posY = y && Math.floor((y / (imgScaledH - tH)) * 100)

	return `${posX}% ${posY}%`
}
