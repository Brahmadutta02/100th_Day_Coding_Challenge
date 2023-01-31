// @ts-nocheck

import { init as initBgImageLayout } from './bgImageLayout'
import { shouldStopImageLoad } from '../../utils/imageUtils'

function wixBgImageWrapper(WixElement, services, environmentConsts, contextWindow = window): any {
	const bgImageLayout = initBgImageLayout(contextWindow)

	class WixBgImage extends WixElement {
		// eslint-disable-next-line @typescript-eslint/no-useless-constructor
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()
		}

		reLayout() {
			// todo: temp experiment for measuring purposes, should be removed after test results
			if (shouldStopImageLoad(services)) {
				return
			}
			const domNodes = {}
			const measures = {}

			const imageId = this.getAttribute('id')
			const imageInfo = JSON.parse(this.dataset.tiledImageInfo)
			const { bgEffectName } = this.dataset
			const { containerId } = imageInfo
			const container = contextWindow.document.getElementById(containerId)

			domNodes[imageId] = this
			domNodes[containerId] = container
			imageInfo.displayMode = imageInfo.imageData.displayMode

			services.mutationService.measure(() => {
				bgImageLayout.measure(imageId, measures, domNodes, { containerId, bgEffectName }, services)
			})

			services.mutationService.mutate(() => {
				bgImageLayout.patch(imageId, measures, domNodes, imageInfo, environmentConsts, services)
			})
		}

		attributeChangedCallback(name, oldValue) {
			if (oldValue) {
				this.reLayout()
			}
		}

		disconnectedCallback() {
			super.disconnectedCallback()
		}

		static get observedAttributes() {
			return ['data-tiled-image-info']
		}
	}

	return WixBgImage
}

export default wixBgImageWrapper
