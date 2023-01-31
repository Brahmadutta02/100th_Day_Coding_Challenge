// @ts-nocheck

import { getScreenHeight, setCssVars, setStyle } from '../../utils/domUtils'

function wixBgMediaWrapper(WixElement, services, contextWindow = window): any {
	const stylesToClear = {
		width: undefined,
		height: undefined,
		left: undefined,
		// top: undefined // TODO: for responsive bg scrub
	}
	class WixBgMedia extends WixElement {
		// eslint-disable-next-line @typescript-eslint/no-useless-constructor
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()
		}

		reLayout() {
			const { containerId, pageId, useCssVars, bgEffectName } = this.dataset
			const container = contextWindow.document.getElementById(`${containerId}`)
			const page = contextWindow.document.getElementById(`${pageId}`)
			const bgScrollMobileExp = services.isExperimentOpen('specs.thunderbolt.bgScrubMobile')
			const measures = {}

			services.mutationService.measure(() => {
				// !! note isFixedStyle in edit mode is false although hasParallax is true
				// todo: remove window.getComputedStyle and use data-is-full-height (TB backlog)
				const isFixedStyle = contextWindow.getComputedStyle(this).position === 'fixed'
				const screenHeight = getScreenHeight(services.getScreenHeightOverride)
				const containerRect = container.getBoundingClientRect()
				const pageRect = page.getBoundingClientRect()
				const dimensionsByEffect = services.getMediaDimensionsByEffect(
					bgEffectName,
					containerRect.width,
					containerRect.height,
					screenHeight
				)
				const { hasParallax } = dimensionsByEffect
				const hasPageTransition = (contextWindow.getComputedStyle(page).transition || '').includes('transform')
				const { width: calculatedWith, height: calculatedHeight } = dimensionsByEffect
				const width = `${calculatedWith}px`
				const height = `${calculatedHeight}px`

				let left = `${(containerRect.width - calculatedWith) / 2}px`

				if (isFixedStyle) {
					const pageLeftPosition = bgScrollMobileExp
						? contextWindow.document.documentElement.clientLeft
						: pageRect.left
					left =
						bgScrollMobileExp && hasPageTransition
							? `${container.offsetLeft - pageLeftPosition}px`
							: `${containerRect.left - pageLeftPosition}px`
				}

				const top = isFixedStyle || hasParallax ? 0 : `${(containerRect.height - calculatedHeight) / 2}px` // will be 0 if no effect

				const dimensions = !useCssVars
					? { width, height, left, top }
					: {
							'--containerW': width,
							'--containerH': height,
							'--containerL': left,
							// '--containerT': top, // TODO: for responsive bg scrub
							'--screenH_val': `${screenHeight}`,
					  }
				Object.assign(measures, dimensions)
			})

			services.mutationService.mutate(() => {
				if (useCssVars) {
					setStyle(this, stylesToClear)
					setCssVars(this, measures)
				} else {
					setStyle(this, measures)
				}
			})
		}

		connectedCallback() {
			super.connectedCallback()

			services.windowResizeService.observe(this)
		}

		disconnectedCallback() {
			super.disconnectedCallback()

			services.windowResizeService.unobserve(this)
		}

		attributeChangedCallback(name, oldValue) {
			if (oldValue) {
				this.reLayout()
			}
		}

		static get observedAttributes() {
			return ['data-is-full-height', 'data-container-size']
		}
	}

	return WixBgMedia
}

export default wixBgMediaWrapper
