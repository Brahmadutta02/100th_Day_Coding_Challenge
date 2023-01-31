import { SelectorObj } from '../../shared.types'
import { constants } from '@wix/thunderbolt-becky-root'
import { getRegularIdSelector } from '../../utils/selectorsUtils'
import { getVariantSelectors } from '../../utils/variantsUtils'
import { DomApplier } from '../cssFeatures.types'
import { Selectors } from '../cssFeature.types'

const { PINNED_LAYER_SUFFIX } = constants

const addLayoutSelectorType = (
	compId: string,
	selector: string,
	layoutSelectorType: string = '',
	shouldOmitWrapperLayers: boolean = false
): string => {
	switch (layoutSelectorType) {
		case '::before':
			return `${selector}::before`
		case 'next-siblings':
			return `${selector} ~ *`
		case 'component-one-cell-grid':
			return `${selector}:not(.${compId}-container)`
		case 'component':
		case 'item':
			return selector
		default:
			if (shouldOmitWrapperLayers) {
				if (selector === getRegularIdSelector(compId)) {
					return `.${compId}-${layoutSelectorType}`
				}
			} else {
				return `${selector} .${compId}-${layoutSelectorType}`
			}
			return selector
	}
}

const responsiveLayoutDomSelector = (
	compId: string,
	idSelector: string,
	variantSelectors: Selectors,
	selector: string,
	shouldOmitWrapperLayers: boolean
): string =>
	variantSelectors
		.map((variantSelector) => addLayoutSelectorType(compId, variantSelector, selector, shouldOmitWrapperLayers))
		.join(',')

const pinnedLayerDomSelector = (idSelector: string): string => `${idSelector}${PINNED_LAYER_SUFFIX}`

export const responsiveLayoutDomApplier: DomApplier<'responsiveLayout'> = (
	compId,
	idSelector,
	breakpointId,
	{ responsiveLayout, pinnedLayer, layoutVariants },
	accumulatedData
) => {
	const acc: SelectorObj = {}
	const responsiveLayoutInBreakpoint = responsiveLayout?.css[breakpointId]
	for (const variantKey in responsiveLayoutInBreakpoint) {
		const variantSelectors = getVariantSelectors(variantKey, layoutVariants, compId, accumulatedData)
		const selectorObj = responsiveLayoutInBreakpoint[variantKey]
		for (const selector in selectorObj) {
			const domSelector = responsiveLayoutDomSelector(
				compId,
				idSelector,
				variantSelectors,
				selector,
				!!responsiveLayout?.shouldOmitWrapperLayers
			)
			acc[domSelector] = Object.assign(acc[domSelector] || {}, selectorObj[selector])
		}
	}

	const pinnedLayerInBreakpoint = pinnedLayer?.[breakpointId]
	for (const variantKey in pinnedLayerInBreakpoint) {
		const selectorObj = pinnedLayerInBreakpoint[variantKey]
		const domSelector = pinnedLayerDomSelector(idSelector)
		for (const selector in selectorObj) {
			acc[domSelector] = selectorObj[selector]
		}
	}

	return acc
}
