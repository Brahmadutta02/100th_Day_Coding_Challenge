import { SelectorObj } from '../../shared.types'
import { getVariantSelectors } from '../../utils/variantsUtils'
import { DomApplier } from '../cssFeatures.types'

export const variablesDomApplier: DomApplier<'variables'> = (
	compId,
	idSelector,
	breakpointId,
	{ variables, variablesVariants },
	accumulatedData
) => {
	const acc: SelectorObj = {}

	const variablesInBreakpoint = variables?.[breakpointId]
	for (const variantKey in variablesInBreakpoint) {
		const variantSelectors = variablesVariants
			? getVariantSelectors(variantKey, variablesVariants, compId, accumulatedData)
			: ['']
		const cssObj = variablesInBreakpoint[variantKey]
		const domSelector = variantSelectors.join(',')
		acc[domSelector] = Object.assign(acc[domSelector] || {}, cssObj)
	}

	return acc
}
