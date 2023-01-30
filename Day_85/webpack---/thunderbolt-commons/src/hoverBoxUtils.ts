export const MODES_TYPE: { [index: string]: string } = {
	hover: 'HOVER',
	default: 'DEFAULT',
}

export const HOVER_SUFFIX = ':hover'

export const DEFAULT_DATA_MODE = '[data-mode=default]'

export const HOVER_DATA_MODE = '[data-mode=hover]'

export const getHoverCompId = (compId: string): string => `${compId}${HOVER_SUFFIX}`

export const getDefaultCompId = (compId: string): string => (compId ? compId.replace(HOVER_SUFFIX, '') : compId)

export const isDefaultCompId = (compId: string): boolean => !compId.endsWith(HOVER_SUFFIX)

const COMP_SELECTOR_PLACEHOLDER = '#<%= compId %>'

export const compIdToCssSelector = (compId: string, shouldReturnPlaceholderSelector: boolean): string => {
	const defaultCompId = getDefaultCompId(compId)
	const fallbackSelector = shouldReturnPlaceholderSelector ? `${COMP_SELECTOR_PLACEHOLDER}` : `#${compId}`
	return compId.endsWith(HOVER_SUFFIX) ? `${HOVER_DATA_MODE} #${defaultCompId}` : fallbackSelector
}
