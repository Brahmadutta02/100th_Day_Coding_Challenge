// @ts-nocheck

import { init as initDropdownMenuLayout } from './dropdownMenuLayout'

function wixDropdownMenuWrapper(WixElement, services, contextWindow = window): any {
	const dropdownMenuLayout = initDropdownMenuLayout(contextWindow)

	class WixDropdownMenu extends WixElement {
		static get observedAttributes() {
			return ['data-hovered-item']
		}
		_visible = false
		_mutationIds = {
			read: null,
			write: null,
		}
		_itemsContainer = null
		_dropContainer = null
		_labelItems = []

		attributeChangedCallback() {
			if (this._isVisible()) {
				this.reLayout()
			}
		}

		connectedCallback() {
			this._id = this.getAttribute('id')
			this._hideElement()
			this._waitForDomLoad().then(() => {
				super.observeResize()
				this._observeChildrenResize()
				this.reLayout()
			})
		}

		disconnectedCallback() {
			services.mutationService.clear(this._mutationIds.read)
			services.mutationService.clear(this._mutationIds.write)

			super.disconnectedCallback()
		}

		_waitForDomLoad() {
			let onReady
			const loadPromise = new Promise((res) => {
				onReady = res
			})

			if (this._isDomReady()) {
				onReady()
			} else {
				this._waitForDomReadyObserver = new contextWindow.MutationObserver(() => this._onRootMutate(onReady))
				this._waitForDomReadyObserver.observe(this, { childList: true, subtree: true })
			}

			return loadPromise
		}

		_isDomReady() {
			this._itemsContainer = contextWindow.document.getElementById(`${this._id}itemsContainer`)
			this._dropContainer = contextWindow.document.getElementById(`${this._id}dropWrapper`)

			return this._itemsContainer && this._dropContainer
		}

		_onRootMutate(onReady) {
			if (this._isDomReady()) {
				this._waitForDomReadyObserver.disconnect()
				onReady()
			}
		}

		_observeChildrenResize() {
			const menuItems = Array.from(this._itemsContainer.childNodes)
			this._labelItems = menuItems.map((item) =>
				contextWindow.document.getElementById(`${item.getAttribute('id')}label`)
			)

			this._labelItems.forEach((item) => super.observeChildResize(item))
		}

		_setVisibility(visible) {
			this._visible = visible
			this.style.visibility = visible ? 'inherit' : 'hidden'
		}

		_isVisible() {
			return this._visible
		}

		_hideElement() {
			this._setVisibility(false)
		}

		_showElement() {
			this._setVisibility(true)
		}

		reLayout() {
			let measures, domNodes

			services.mutationService.clear(this._mutationIds.read)
			services.mutationService.clear(this._mutationIds.write)

			this._mutationIds.read = services.mutationService.measure(() => {
				const measureResult = dropdownMenuLayout.measure(this._id, services)
				measures = measureResult.measures
				domNodes = measureResult.domNodes
			})

			this._mutationIds.write = services.mutationService.mutate(() => {
				dropdownMenuLayout.patch(this._id, measures, domNodes)
				this._showElement()
			})
		}
	}

	return WixDropdownMenu
}

export default wixDropdownMenuWrapper
