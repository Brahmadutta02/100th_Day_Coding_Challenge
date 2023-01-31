import fastdom from 'fastdom'
import type { IFluidColumnsRepeater } from './types'

type ItemStyle = {
	top: HTMLElement['style']['top']
	right?: HTMLElement['style']['right']
	left?: HTMLElement['style']['left']
	id: string
}

type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between'

export const defineRepeaterCustomElement = (window: Window) => {
	if (window.customElements && !window.customElements.get('fluid-columns-repeater')) {
		class FluidColumnsRepeater extends window.HTMLElement implements IFluidColumnsRepeater {
			private styleElement?: HTMLStyleElement
			private itemWidth: number = 0
			private repeaterWidth: number = 0
			private itemsObserver: ResizeObserver
			private widthObserver: ResizeObserver
			private observer: MutationObserver
			private waitForUpdate: boolean = false

			constructor() {
				super()
				document.createElement('div')
				this.handleItemAdded = this.handleItemAdded.bind(this)
				this.itemsObserver = new window.ResizeObserver((entries: Array<ResizeObserverEntry>) => {
					this.itemWidth = entries[0].contentRect.width
					this.updateAbsoluteStyles()
				})
				this.widthObserver = new window.ResizeObserver((entries: Array<ResizeObserverEntry>) =>
					this.onRepeaterResized(entries)
				)
				this.observer = this.createMutationObserver()
			}

			disconnectedCallback() {
				this.widthObserver.disconnect()
				this.observer.disconnect()
			}

			private handleItemAdded(node: Node) {
				const isList = this.getAttribute('role') === 'list'
				if (node instanceof HTMLElement) {
					if (isList) {
						node.setAttribute('role', 'listitem')
					}
					this.itemsObserver.observe(node)
				}
			}

			connectedCallback() {
				this.styleElement = this.getStyleElement()

				this.widthObserver.observe(this)
				// Options for the observer (which mutations to observe)
				const config = {
					attributes: false,
					childList: true,
					subtree: false,
				}

				// Handle initial items
				Array.from(this.childNodes).forEach(this.handleItemAdded)

				// Start observing the target node for configured mutations
				this.observer.observe(this, config)
			}

			private getStyleElement() {
				const styleId = `${this.containerId}-styles`
				let styleElement = window.document.getElementById(styleId) as HTMLStyleElement
				if (styleElement) {
					styleElement.textContent = ''
				} else {
					styleElement = window.document.createElement('style')
					styleElement.id = styleId
					window.document.head.appendChild(styleElement)
				}

				return styleElement
			}

			private createMutationObserver() {
				// Callback function to execute when mutations are observed
				const callback: MutationCallback = (mutationsList) => {
					mutationsList.forEach((mutation) => {
						Array.from(mutation.removedNodes).forEach((node) => {
							if (node instanceof window.HTMLElement) {
								this.itemsObserver.unobserve(node)
							}
						})
						Array.from(mutation.addedNodes).forEach(this.handleItemAdded)
					})
				}

				// Create an observer instance linked to the callback function
				const observer = new window.MutationObserver(callback)

				return observer
			}

			private onRepeaterResized(entries: Readonly<Array<ResizeObserverEntry>>): void {
				const repeaterWidth = entries[0].contentRect.width
				if (this.repeaterWidth !== repeaterWidth) {
					this.repeaterWidth = repeaterWidth
					this.updateAbsoluteStyles()
				}
			}

			private getStyleCss(repeaterHeight: number, styles: Array<ItemStyle>) {
				const itemStyles = styles.map((style) => {
					const position = style.left ? `left: ${style.left}` : `right: ${style.right}`
					return `#${this.containerId} #${style.id} {position: absolute; top: ${style.top};${position}; margin: 0;}`
				})

				const repeaterStyle = `#${this.containerId}, #${this.containerId} > fluid-columns-repeater { height: ${repeaterHeight}px; display: block;}`
				return [repeaterStyle, ...itemStyles].join('\n')
			}

			attributeChangedCallback(__: string, oldValue: string, newValue: string) {
				if (oldValue && oldValue !== newValue) {
					this.updateAbsoluteStyles()
				}
			}

			static get observedAttributes() {
				return ['vertical-gap', 'horizontal-gap', 'justify-content', 'direction']
			}

			private get numberOfItems(): number {
				return parseInt(this.getAttribute('items')!, 10)
			}

			private get verticalGap(): number {
				return parseInt(this.getAttribute('vertical-gap')!, 10)
			}

			private get horizontalGap(): number {
				return parseInt(this.getAttribute('horizontal-gap')!, 10)
			}

			private get containerId(): string {
				return this.getAttribute('container-id')!
			}

			private get direction(): 'rtl' | 'ltr' {
				return this.getAttribute('direction') as 'rtl' | 'ltr'
			}

			private get justifyContent(): JustifyContent {
				return this.getAttribute('justify-content') as JustifyContent
			}

			private getNumberOfColumns({
				repeaterWidth,
				itemWidth,
				horizontalGap,
			}: {
				repeaterWidth: number
				itemWidth: number
				horizontalGap: number
			}) {
				return Math.max(Math.floor(repeaterWidth / (itemWidth + horizontalGap * 2)), 1)
			}

			private getItemHorizontalPosition({
				repeaterWidth,
				itemWidth,
				column,
				horizontalGap,
				justifyContent,
			}: {
				repeaterWidth: number
				itemWidth: number
				column: number
				horizontalGap: number
				justifyContent: JustifyContent
			}): number {
				const numberOfColumns = Math.min(
					this.getNumberOfColumns({
						repeaterWidth,
						itemWidth,
						horizontalGap,
					}),
					this.numberOfItems
				)
				const marginLeft = repeaterWidth - numberOfColumns * (itemWidth + horizontalGap * 2)

				const flexStartPosition = itemWidth! * column + horizontalGap * ((column + 1) * 2 - 1)
				switch (justifyContent) {
					case 'flex-start':
						return flexStartPosition
					case 'flex-end':
						return marginLeft + flexStartPosition
					case 'center':
						return marginLeft / 2 + flexStartPosition
					default:
						return flexStartPosition === 0
							? flexStartPosition
							: (marginLeft / (numberOfColumns - 1)) * column + flexStartPosition
				}
			}

			async updateAbsoluteStyles() {
				if (this.waitForUpdate) {
					return
				}
				this.waitForUpdate = true
				fastdom.measure(() => {
					const children = Array.from(this.children)
					if (!children.length) {
						this.waitForUpdate = false
						return
					}

					if (this.itemWidth === 0) {
						this.itemWidth = children[0].clientWidth
					}
					const itemsSizes = children.map<{ width: number; height: number }>((child) => ({
						width: child.clientWidth,
						height: child.clientHeight,
					}))
					this.waitForUpdate = false

					fastdom.mutate(() => {
						const {
							numberOfItems,
							itemWidth,
							repeaterWidth,
							horizontalGap,
							verticalGap,
							justifyContent,
							direction,
						} = this
						if (Object.keys(itemsSizes).length !== numberOfItems || !itemWidth || !repeaterWidth) {
							return
						}

						const numberOfColumns = this.getNumberOfColumns({
							repeaterWidth,
							itemWidth,
							horizontalGap,
						})

						let repeaterHeight = 0
						const tops = children.reduce((acc, __, index) => {
							const nextItemInColumnTop = acc[index] + itemsSizes[index]!.height + 2 * verticalGap
							if (index < numberOfItems - numberOfColumns) {
								return [...acc, nextItemInColumnTop]
							}
							repeaterHeight = Math.max(nextItemInColumnTop - verticalGap, repeaterHeight)
							return acc
						}, new Array(numberOfColumns).fill(verticalGap))
						repeaterHeight -= 2 * verticalGap
						const horizontalCssKey = direction === 'ltr' ? 'left' : 'right'
						const styles = children.reduce<Array<ItemStyle>>((acc, { id }, index) => {
							const column = index % numberOfColumns
							const itemHorizontalPosition = this.getItemHorizontalPosition({
								itemWidth,
								horizontalGap,
								column,
								justifyContent,
								repeaterWidth,
							})

							const itemStyles = {
								id,
								top: `${tops[index]}px`,
								[horizontalCssKey]: `${itemHorizontalPosition}px`,
							}
							return [...acc, itemStyles]
						}, [])

						this.styleElement!.textContent = this.getStyleCss(repeaterHeight, styles)
						this.style.setProperty('visibility', null)
					})
				})
			}
		}

		window.customElements.define('fluid-columns-repeater', FluidColumnsRepeater)
	}
}
