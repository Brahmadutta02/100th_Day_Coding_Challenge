// @ts-nocheck

import videoLayout from './videoLayout'

function wixVideoWrapper(WixElement, services, environmentConsts, contextWindow = window): any {
	class wixVideo extends WixElement {
		// eslint-disable-next-line @typescript-eslint/no-useless-constructor
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()
		}

		reLayout() {
			const {
				isVideoDataExists,
				videoWidth,
				videoHeight,
				qualities,
				videoId,
				videoFormat,
				alignType,
				fittingType,
				focalPoint,
				hasBgScrollEffect,
				autoPlay,
				animatePoster,
				containerId,
				isEditorMode,
				playbackRate,
				hasAlpha,
			} = JSON.parse(this.dataset.videoInfo)

			if (!isVideoDataExists) {
				return
			}

			const autoPlayAllowed = !environmentConsts.prefersReducedMotion && autoPlay

			const videoNode = this.querySelector(`video[id^="${containerId}"]`)
			const poster = this.querySelector(`.bgVideoposter[id^="${containerId}"]`)

			// if observed for missing video/poster, first cleanup, otherwise it's a noop
			this.unobserveChildren()

			if (!(videoNode && poster)) {
				this.observeChildren(this)
				return
			}

			const container = contextWindow.document.getElementById(`${containerId}`)
			const canvas = container.querySelector(`.webglcanvas[id^="${containerId}"]`)
			const hasThunderBoltCanvas = hasAlpha || container.dataset.hasAlpha === 'true'

			if (hasThunderBoltCanvas && !canvas) {
				requestAnimationFrame(() => this.reLayout())
				return
			}

			services.mutationService.measure(() => {
				const measures = videoLayout.measure(videoNode, container, {
					hasBgScrollEffect,
					videoWidth,
					videoHeight,
					fittingType,
					alignType,
					qualities,
					staticVideoUrl: environmentConsts.staticVideoUrl,
					videoId,
					videoFormat,
					focalPoint,
				})

				const { videoSourceUrl, needsSrcUpdate, videoStyle } = measures
				services.mutationService.mutate(() => {
					videoLayout.mutate(
						poster,
						canvas,
						videoNode,
						videoStyle,
						autoPlayAllowed,
						videoSourceUrl,
						needsSrcUpdate,
						animatePoster,
						videoFormat,
						playbackRate,
						isEditorMode
					)
				})
			})
		}

		attributeChangedCallback(name, oldValue) {
			if (oldValue) {
				this.reLayout()
			}
		}

		static get observedAttributes() {
			return ['data-video-info']
		}
	}

	return wixVideo
}

export default wixVideoWrapper
