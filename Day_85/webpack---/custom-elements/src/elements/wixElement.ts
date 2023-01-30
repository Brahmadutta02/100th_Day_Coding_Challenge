// @ts-nocheck

function wixElementWrapper(services, contextWindow = window): any {
	class WixElement extends contextWindow.HTMLElement {
		// eslint-disable-next-line @typescript-eslint/no-useless-constructor
		constructor() {
			// eslint-disable-line no-useless-constructor
			super()
		}

		reLayout() {
			// should be implemented inside child element
		}

		connectedCallback() {
			this.observeResize()
			this.reLayout()
		}

		disconnectedCallback() {
			this.unobserveResize()
			this.unobserveChildren()
		}

		observeResize() {
			services.resizeService.observe(this)
		}

		unobserveResize() {
			services.resizeService.unobserve(this)
		}

		/** 01
		 * Observe DOM mutations to wait for addition of missing children
		 *
		 * @param {HTMLElement} el
		 */
		observeChildren(el) {
			if (!this.childListObserver) {
				this.childListObserver = new contextWindow.MutationObserver(() => this.reLayout())
			}

			this.childListObserver.observe(el, { childList: true })
		}

		observeChildAttributes(el, attributes = []) {
			if (!this.childrenAttributesObservers) {
				this.childrenAttributesObservers = []
			}
			const attributesObserver = new contextWindow.MutationObserver(() => this.reLayout())
			attributesObserver.observe(el, { attributeFilter: attributes })
			this.childrenAttributesObservers.push(attributesObserver)
		}

		observeChildResize(child) {
			if (!this.childrenResizeObservers) {
				this.childrenResizeObservers = []
			}
			services.resizeService.observeChild(child, this)
			this.childrenResizeObservers.push(child)
		}

		unobserveChildrenResize() {
			if (this.childrenResizeObservers) {
				this.childrenResizeObservers.forEach((child) => {
					services.resizeService.unobserveChild(child)
				})
				this.childrenResizeObservers = null
			}
		}

		/**
		 * Remove DOM MutationObserver if one was created
		 */
		unobserveChildren() {
			if (this.childListObserver) {
				this.childListObserver.disconnect()
				this.childListObserver = null
			}
			if (this.childrenAttributesObservers) {
				for (let observer of this.childrenAttributesObservers) {
					observer.disconnect()
					observer = null
				}
				this.childrenAttributesObservers = null
			}

			this.unobserveChildrenResize()
		}
	}

	return WixElement
}

export default wixElementWrapper
