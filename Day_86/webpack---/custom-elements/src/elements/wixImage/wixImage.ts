// @ts-nocheck

import ImageLoader from './imageLoader'
import { getImageSrc, shouldStopImageLoad } from '../../utils/imageUtils'
import imageLayout from './imageLayout'
import imageLayoutResponsive from './imageLayoutResponsive'

const TIMEOUT = 250

function wixImageWrapper(WixElement, services, environmentConsts, contextWindow = window): any {
	if (!services.imageLoader) {
		services.imageLoader = new ImageLoader(
			services.mutationService,
			contextWindow,
			services.isExperimentOpen('specs.thunderbolt.use_fetch_priority_in_image_loader')
		)
	}

	class WixImage extends WixElement {
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()

			this.childListObserver = null
			this.timeoutId = null
		}

		reLayout() {
			// todo: temp experiment for measuring purposes, should be removed after test results
			if (shouldStopImageLoad(services)) {
				return
			}
			const domNodes = {}
			const measures = {}

			const imageId = this.getAttribute('id')
			const imageInfo = JSON.parse(this.dataset.imageInfo)
			const isSvg = this.dataset.isSvg === 'true'
			const isSvgMask = this.dataset.isSvgMask === 'true'
			const isResponsive = this.dataset.isResponsive === 'true'
			const { bgEffectName } = this.dataset

			domNodes[imageId] = this
			if (imageInfo.containerId) {
				domNodes[imageInfo.containerId] = contextWindow.document.getElementById(`${imageInfo.containerId}`)
			}
			domNodes.image = this.querySelector(isSvg ? 'image' : 'img')
			domNodes.svg = isSvg ? this.querySelector('svg') : null
			domNodes.picture = this.querySelector('picture')
			const containerElm = imageInfo.containerId && domNodes[imageInfo.containerId]
			// override positioning and scaling of image (SiteBackground mobile override behaviour)
			const mediaHeightOverrideType = containerElm && containerElm.dataset.mediaHeightOverrideType

			if (isSvgMask) {
				domNodes.maskSvg = domNodes.svg && domNodes.svg.querySelector('svg')
			}

			if (!domNodes.image) {
				// missing children, can't layout, wait for children to be created first
				// if isSvg==false || we don't have SVG yet -> use `this`
				const target = isSvg ? domNodes.svg || this : this
				this.observeChildren(target)
				return
			}

			// clean up
			this.unobserveChildren()

			// from now on just observe changes to children of top level
			this.observeChildren(this)

			// perform the layout
			const layout = isResponsive || domNodes.picture ? imageLayoutResponsive : imageLayout // TODO: remove domNodes.picture after wix-ui-santa comes to production 08/03/2020

			services.mutationService.measure(() => {
				layout.measure(
					imageId,
					measures,
					domNodes,
					{
						containerElm,
						isSvg,
						isSvgMask,
						mediaHeightOverrideType,
						bgEffectName,
					},
					services
				)
			})

			const patchImage = (shouldLoadImage) => {
				services.mutationService.mutate(() => {
					layout.patch(
						imageId,
						measures,
						domNodes,
						imageInfo,
						services,
						environmentConsts,
						shouldLoadImage,
						bgEffectName
					)
				})
			}
			// if image has no src or current src if from ssr render stage  -
			// load the image immediately, otherwise - debounce the reload
			if (!getImageSrc(domNodes.image, isSvg) || this.dataset.hasSsrSrc) {
				patchImage(true)
			} else {
				this.debounceImageLoad(patchImage)
			}
		}

		/**
		 * Debounce consecutive image loads
		 *
		 * @param patchImage - closure for patching the image
		 */
		debounceImageLoad(patchImage) {
			clearTimeout(this.timeoutId)

			this.timeoutId = setTimeout(() => {
				patchImage(true)
			}, TIMEOUT)

			patchImage(false)
		}

		attributeChangedCallback(name, oldValue) {
			if (oldValue) {
				this.reLayout()
			}
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			services.imageLoader.onImageDisconnected(this)

			this.unobserveChildren()
		}

		static get observedAttributes() {
			return ['data-image-info']
		}
	}

	return WixImage
}

export default wixImageWrapper
