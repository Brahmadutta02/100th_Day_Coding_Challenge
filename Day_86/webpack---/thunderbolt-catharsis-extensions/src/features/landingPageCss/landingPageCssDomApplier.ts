import { DomApplier } from '../cssFeatures.types'
import { SelectorObj } from '../../shared.types'
import { getRegularIdSelector } from '../../utils/selectorsUtils'

const LANDING_PAGE_SELECTOR = `#masterPage.landingPage`
const DISPLAY_NONE = { display: 'none' } as const

export const landingPageCssDomApplier: DomApplier<'landingPages'> = (
	__,
	_idSelector,
	_breakpointId,
	{ landingPagesCss }
) => {
	if (Array.isArray(landingPagesCss)) {
		return {}
	}

	return {
		...landingPagesCss.css,
		...landingPagesCss.componentsToHide.reduce<SelectorObj>((acc, id) => {
			const selector = `${LANDING_PAGE_SELECTOR} ${getRegularIdSelector(id)}`
			acc[selector] = DISPLAY_NONE
			return acc
		}, {}),
	}
}
