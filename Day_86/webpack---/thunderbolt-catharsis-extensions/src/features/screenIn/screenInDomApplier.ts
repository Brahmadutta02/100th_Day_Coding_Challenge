import { DomApplier } from '../cssFeatures.types'

const SCREEN_IN_SELECTOR = ':not([data-screen-in-hide="done"])'
const OPACITY_ZERO = { opacity: 0 }

export const screenInDomApplier: DomApplier<'screenIn'> = (__, idSelector, breakpointId, { hasScreenIn }) => {
	if (!hasScreenIn || breakpointId !== 'default') {
		return {}
	}

	return {
		[`${idSelector}${SCREEN_IN_SELECTOR}`]: OPACITY_ZERO,
	}
}
