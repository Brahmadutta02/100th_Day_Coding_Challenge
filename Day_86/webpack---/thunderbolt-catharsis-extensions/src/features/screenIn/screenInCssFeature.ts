import { hasScreenIn } from './hasScreenInCompNode'
import { ScreenInCssFeature } from './screenIn.types'
import { screenInDomApplier } from './screenInDomApplier'

export const screenInCssFeature: ScreenInCssFeature = {
	experimentName: 'specs.thunderbolt.comps_to_hide_catharsis',
	renderableNodes: { hasScreenIn },
	intermediateNodes: {},
	dataMaps: ['behaviors_data'],
	domApplier: screenInDomApplier,
}
