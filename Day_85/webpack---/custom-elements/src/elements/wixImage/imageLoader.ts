// @ts-nocheck

import { getImageSrc } from '../../utils/imageUtils'

const SCROLL_EFFECT_CSS_CLASS = 'scroll-css-var--scrollEffect'

// exclusion of Edge18: https://jira.wixpress.com/browse/BOLT-1828
const isEdge18 = (contextWindow) => /Edge\/18/.test(contextWindow.navigator.userAgent)

const isIntersectionObserverSupported = (contextWindow) =>
	contextWindow &&
	'IntersectionObserver' in contextWindow &&
	'IntersectionObserverEntry' in contextWindow &&
	'intersectionRatio' in contextWindow.IntersectionObserverEntry.prototype &&
	'isIntersecting' in contextWindow.IntersectionObserverEntry.prototype &&
	!isEdge18(contextWindow) // due to bug in intersectionObserver Edge18 for strips with parallax|reveal effect, images in fixed position

class ImageLoader {
	constructor(mutationService, contextWindow = window, useFetchPriority) {
		this.mutationService = mutationService
		this.useFetchPriority = useFetchPriority

		if (isIntersectionObserverSupported(contextWindow)) {
			this.intersectionObserver = new contextWindow.IntersectionObserver(this.getViewPortIntersectionHandler(), {
				rootMargin: '50% 0px',
			})

			this.scrollEffectsIntersectionObserver = new contextWindow.IntersectionObserver(
				this.getScrollEffectsIntersectionHandler(),
				{ rootMargin: '10% 0px' }
			)
		}
	}

	isImageInViewPort(boundingRect, screenHeight) {
		return boundingRect.top + boundingRect.height >= 0 && boundingRect.bottom - boundingRect.height <= screenHeight
	}

	loadImage(wixImageNode, { screenHeight, boundingRect, withScrollEffectVars }) {
		// TODO: do not check manually is-in-viewport, breaks lazy-load of fixed positioned images
		// but find solution for hover-box blink
		if (!this.intersectionObserver || this.isImageInViewPort(boundingRect, screenHeight)) {
			this.setImageSource(wixImageNode)
		} else {
			this.intersectionObserver.unobserve(wixImageNode)
			this.intersectionObserver.observe(wixImageNode)
		}

		if (withScrollEffectVars && this.scrollEffectsIntersectionObserver) {
			this.scrollEffectsIntersectionObserver.unobserve(wixImageNode)
			this.scrollEffectsIntersectionObserver.observe(wixImageNode)
		}
	}

	onImageDisconnected(wixImageNode) {
		if (this.intersectionObserver) {
			this.intersectionObserver.unobserve(wixImageNode)
		}

		if (this.scrollEffectsIntersectionObserver) {
			this.scrollEffectsIntersectionObserver.unobserve(wixImageNode)
		}
	}

	setSrcAttribute(imageNode, isSvg, hasSrcset, src) {
		const currentSrc = getImageSrc(imageNode, isSvg)
		if (currentSrc === src) {
			return
		}

		if (isSvg) {
			imageNode.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		} else {
			// Fix Safari +15.4 issue - setting src when loading="lazy" doesn't load the new src
			if (imageNode.hasAttribute('loading')) {
				imageNode.removeAttribute('loading')
			}

			if (hasSrcset) {
				imageNode.setAttribute('srcset', src)
			}

			if (this.useFetchPriority) {
				imageNode.setAttribute('fetchpriority', 'high')
			}

			imageNode.src = src
		}
	}

	setSourceSetAttribute(sourceNode, src) {
		const currentSrc = sourceNode.srcset
		if (currentSrc === src) {
			return
		}

		sourceNode.srcset = src
	}

	setImageSource(wixImageNode) {
		const isSvg = wixImageNode.dataset.isSvg === 'true'
		const imageNode = wixImageNode.querySelector(isSvg ? 'image' : 'img')
		const hasSrcset = imageNode.hasAttribute('srcset')
		const pictureNode = wixImageNode.querySelector('picture')

		this.setSrcAttribute(imageNode, isSvg, hasSrcset, wixImageNode.dataset.src)

		if (pictureNode) {
			Array.from(pictureNode.querySelectorAll('source')).forEach((sourceNode) => {
				this.setSourceSetAttribute(sourceNode, sourceNode.dataset.srcset)
			})
		}
	}

	getViewPortIntersectionHandler() {
		return (entries, observer) => {
			entries
				.filter((entry) => entry.isIntersecting)
				.forEach((entry) => {
					const lazyImage = entry.target
					this.setImageSource(lazyImage)
					observer.unobserve(lazyImage)
				})
		}
	}

	getScrollEffectsIntersectionHandler() {
		return (entries) =>
			entries.forEach((entry) => {
				const wixImageNode = entry.target
				if (entry.isIntersecting) {
					this.mutationService.mutate(() => wixImageNode.classList.add(SCROLL_EFFECT_CSS_CLASS))
				} else {
					this.mutationService.mutate(() => wixImageNode.classList.remove(SCROLL_EFFECT_CSS_CLASS))
				}
			})
	}
}

export default ImageLoader
