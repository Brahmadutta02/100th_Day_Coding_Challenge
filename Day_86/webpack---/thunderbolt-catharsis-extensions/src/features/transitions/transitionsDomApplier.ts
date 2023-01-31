import type { DomApplier } from '../cssFeatures.types'
import type { SelectorObj } from '../../shared.types'
import type { TransitionData } from '@wix/thunderbolt-becky-types'
import { getVariantSelectors } from '../../utils/variantsUtils'

export const NOT_ANIMATING_SCREEN_IN_SELECTOR = ':not(.is-animating)'

const getCSSObjectFromTransitionItem = (styleItem: TransitionData) => {
	const property = 'all'
	const { 'timing-function': timingFunction = 'ease', duration = 0, delay = 0 } = styleItem
	return { transition: `${property} ${duration}s ${timingFunction} ${delay}s` }
}

export const transitionsDomApplier: DomApplier<'transitions'> = (
	compId,
	idSelector,
	breakpointId,
	{ transitionsVariants, transitions },
	accumulatedData
) => {
	if (!transitions) {
		return {}
	}

	const transitionsInBreakpoint = transitions.breakpointToTransition[breakpointId] || {}

	return Object.entries(transitionsInBreakpoint).reduce<SelectorObj>((acc, [variantKey, transitionData]) => {
		const variantSelectors = transitionsVariants
			? getVariantSelectors(variantKey, transitionsVariants, compId, accumulatedData)
			: ['']
		const cssFromTransitionItem = getCSSObjectFromTransitionItem(transitionData)
		const hasCondition = !!transitionsVariants?.[variantKey]

		const domSelector = variantSelectors
			.map((variantSelector) => {
				const selectorWithChildren =
					transitions.componentType === 'Container'
						? `${variantSelector}, ${variantSelector} > `
						: `${variantSelector}, ${variantSelector} `

				return `${hasCondition ? selectorWithChildren : `${idSelector}`}${NOT_ANIMATING_SCREEN_IN_SELECTOR}`
			})
			.join(',')

		acc[domSelector] = Object.assign(acc[domSelector] || {}, cssFromTransitionItem)

		if (!hasCondition) {
			acc[`${domSelector} ${NOT_ANIMATING_SCREEN_IN_SELECTOR}`] = Object.assign(
				acc[`${domSelector} ${NOT_ANIMATING_SCREEN_IN_SELECTOR}`] || {},
				{ transition: `${cssFromTransitionItem.transition}, visibility 0s` }
			)
		}

		return acc
	}, {})
}
