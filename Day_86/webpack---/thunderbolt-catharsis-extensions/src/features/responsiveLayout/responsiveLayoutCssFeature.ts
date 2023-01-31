import { compLayouts } from './compLayoutsCompNode'
import { layoutVariants } from './layoutVariantsCompNode'
import { pinnedLayer } from './pinnedLayerCompNode'
import { ResponsiveLayoutCssFeature } from './responsiveLayout.types'
import { responsiveLayout } from './responsiveLayoutCompNode'
import { responsiveLayoutDomApplier } from './responsiveLayoutDomApplier'

export const responsiveLayoutCssFeature: ResponsiveLayoutCssFeature = {
	experimentName: 'specs.thunderbolt.new_responsive_layout',
	renderableNodes: { responsiveLayout, pinnedLayer, layoutVariants },
	intermediateNodes: { compLayouts },
	dataMaps: ['layout_data', 'variants_data'],
	domApplier: responsiveLayoutDomApplier,
}
