import _ from 'lodash'
import { BeckyExperiments } from '@wix/thunderbolt-commons'
import { componentCssFactory } from './componentCssCompNode'
import { componentPatternsFactory } from './commonCssData/patternsCompNode'
import { EditorCssFeatures, ViewerCssFeatures } from './cssFeatures.types'
import { responsiveLayoutCssFeature } from './responsiveLayout/responsiveLayoutCssFeature'
import { variablesCssFeature } from './variables/variablesCssFeature'
import { screenInCssFeature } from './screenIn/screenInCssFeature'
import { landingPageCssFeature } from './landingPageCss/landingPageCssFeature'
import { classicRotationFeature } from './classicRotation/classicRotationFeature'
import { transitionsCssFeature } from './transitions/transitionsCssFeature'
import { pinnedLayoutCssFeature } from './pinnedLayout/pinnedLayoutCssFeature'
import { DataMapName } from '@wix/thunderbolt-becky-types'

export const viewerCssFeatures: ViewerCssFeatures = {
	classicRotation: classicRotationFeature,
	landingPages: landingPageCssFeature,
	responsiveLayout: responsiveLayoutCssFeature,
	variables: variablesCssFeature,
	screenIn: screenInCssFeature,
	transitions: transitionsCssFeature,
	pinnedLayout: pinnedLayoutCssFeature,
}
export const editorCssFeatures: EditorCssFeatures = {
	...viewerCssFeatures,
	// layout runtime
}

export const defaultDataMaps: Array<DataMapName> = ['patterns', 'variants_data']

export type IsExperimentOpen = (experimentName: keyof BeckyExperiments) => boolean

export const componentCssFeaturesProvider = (
	componentCssFeatures: ViewerCssFeatures | EditorCssFeatures,
	isExperimentOpen: IsExperimentOpen
) => {
	const activeCssFeatures = _.pickBy(componentCssFeatures, (feature) => isExperimentOpen(feature.experimentName))

	const componentNodes = Object.values(activeCssFeatures).reduce(
		(acc, { renderableNodes, intermediateNodes }) => ({ ...acc, ...renderableNodes, ...intermediateNodes }),
		{
			repeaterPatterns: componentPatternsFactory(),
			componentCss: componentCssFactory(activeCssFeatures),
		}
	)

	const usedDataMaps = new Set(
		Object.values(activeCssFeatures)
			.flatMap(({ dataMaps }) => dataMaps)
			.concat(defaultDataMaps)
	)

	return { componentNodes, usedDataMaps }
}
