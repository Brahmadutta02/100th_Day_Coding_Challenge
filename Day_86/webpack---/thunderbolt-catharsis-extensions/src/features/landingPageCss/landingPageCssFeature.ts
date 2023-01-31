import { LandingPageCssFeature } from './landingPageCss.types'
import { landingPagesCss } from './landingPageCssCompNode'
import { landingPageCssDomApplier } from './landingPageCssDomApplier'

export const landingPageCssFeature: LandingPageCssFeature = {
	experimentName: 'specs.thunderbolt.landing_page_css_catharsis',
	renderableNodes: { landingPagesCss },
	intermediateNodes: {},
	dataMaps: ['document_data'],
	domApplier: landingPageCssDomApplier,
}
