import { BrowserWindow } from '@wix/thunderbolt-symbols'

export type CssOverrides = { [prop: string]: string }

export const getRuntimeStyleOverridesManager = () => {
	const stylePropertiesToClean: { [compId: string]: Array<string> } = {}

	const styleOverrides = {
		setItemCssOverrides: (cssOverrides: CssOverrides, selector: string, window: NonNullable<BrowserWindow>) => {
			const node = window.document.querySelector<HTMLElement>(selector)
			if (node) {
				Object.assign(node.style, cssOverrides)

				stylePropertiesToClean[selector] = (stylePropertiesToClean[selector] || []).concat(
					Object.keys(cssOverrides)
				)
			}
		},
		clearItemCssOverrides: (selector: string, window: NonNullable<BrowserWindow>) => {
			const itemOverrides = stylePropertiesToClean[selector]
			if (!itemOverrides) {
				return
			}

			const compStylePropertiesToClean = new Set([...itemOverrides])

			const node = window.document.querySelector<HTMLElement>(selector)
			if (node) {
				compStylePropertiesToClean.forEach((prop) => node.style.removeProperty(prop))

				if (node.getAttribute('style') === '') {
					node.removeAttribute('style')
				}
			}

			delete stylePropertiesToClean[selector]
		},
		clearAllItemsCssOverrides: (window: NonNullable<BrowserWindow>) => {
			Object.keys(stylePropertiesToClean).forEach((selector) => {
				styleOverrides.clearItemCssOverrides(selector, window)
			})
		},
	}

	return styleOverrides
}
