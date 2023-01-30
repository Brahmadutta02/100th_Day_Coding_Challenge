// @ts-nocheck

import biEvents from './bi/events'

function wixIframeWrapper(WixElement, services): any {
	class WixIframe extends WixElement {
		// eslint-disable-next-line @typescript-eslint/no-useless-constructor
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()
		}

		reportIframeStartLoading(iframe) {
			const { isTpa, widgetId, appDefinitionId } = this.dataset
			if (services && services.biService && isTpa === 'true') {
				services.biService.reportTpaBiEvent({
					reportDef: biEvents.APP_IFRAME_START_LOADING,
					params: {},
					compId: iframe.getAttribute('name'),
					isWixTPA: true,
					widgetId,
					appDefinitionId,
				})
			}
		}

		reLayout() {
			// TODO - add lazy loading if bv_lazyTPAs experiment is merged
			// TODO - handle instance templating from clientSpecMap once we implement static html loading
			const iframe = this.querySelector('iframe')
			if (iframe) {
				const dataSrc = iframe.dataset.src
				if (dataSrc && iframe.src !== dataSrc) {
					iframe.src = dataSrc
					iframe.dataset.src = ''
					this.dataset.src = ''
					this.reportIframeStartLoading(iframe)
				}
			}
		}

		attributeChangedCallback(name, oldValue, newValue) {
			if (newValue) {
				this.reLayout()
			}
		}

		static get observedAttributes() {
			return ['data-src']
		}
	}

	return WixIframe
}

export default wixIframeWrapper
