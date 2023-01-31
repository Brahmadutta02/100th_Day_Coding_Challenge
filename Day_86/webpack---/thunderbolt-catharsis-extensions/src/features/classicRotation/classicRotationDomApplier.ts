import { DomApplier } from '../cssFeatures.types'
import { Modes, SelectorObj } from '../../shared.types'

const EMPTY_OBJECT: Record<string, any> = {}

export const rotatedComponentsStyleDomApplier: DomApplier<'classicRotation'> = (
	compId,
	idSelector, // idSelector is the same as `#${compId}` or '#[id^compId__]' if compId is a repeater
	breakpointId,
	{ classicRotation }
) => {
	if (!classicRotation) {
		return EMPTY_OBJECT
	}

	const acc: SelectorObj = {}
	for (const prefix in classicRotation.css) {
		const result = classicRotation.css[prefix as Modes]
		if (result) {
			const selector = prefix ? `${prefix} ${idSelector}` : idSelector
			acc[selector] = result
		}
	}
	return acc
}
