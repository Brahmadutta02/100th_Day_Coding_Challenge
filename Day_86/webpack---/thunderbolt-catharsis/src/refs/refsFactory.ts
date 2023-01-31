import { createRef } from '@wix/materializer'
import { ThemeFontMap } from '@wix/thunderbolt-becky-types'
import type { BeckyModel } from '@wix/thunderbolt-becky-root'

export const envRefs = {
	renderScrollSnap: createRef<boolean>(['environment', 'renderFlags', 'renderScrollSnap']),
	renderSticky: createRef<boolean>(['environment', 'renderFlags', 'renderSticky']),
	showScreenInComp: createRef<boolean>(['environment', 'renderFlags', 'showScreenInComp']),
	experiment: (experiment: string) => createRef<boolean>(['environment', 'experiments', experiment]),
	// Where this should be?
	isMobileView: createRef<boolean>(['environment', 'mobile', 'isMobileView']),
	viewMode: createRef<'mobile' | 'desktop'>(['environment', 'atoms', 'viewMode']),
	componentViewMode: createRef<BeckyModel['renderFlags']['componentViewMode']>([
		'environment',
		'renderFlags',
		'componentViewMode',
	]),
	enableVariantsTransitionsInEditor: createRef<BeckyModel['enableVariantsTransitionsInEditor']>([
		'environment',
		'atoms',
		'enableVariantsTransitionsInEditor',
	]),
}

export const themeRefs = {
	themeFonts: createRef<ThemeFontMap>(['data', 'theme_data', 'THEME_DATA', 'fontMap']),
}
