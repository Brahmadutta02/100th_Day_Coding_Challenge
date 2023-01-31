import { PinnedLayoutCssFeature } from './pinnedLayout.types'
import { pinnedLayoutDomApplier } from './pinnedLayoutDomApplier'
import { pinnedStyle } from './pinnedLayoutCompNode'

export const pinnedLayoutCssFeature: PinnedLayoutCssFeature = {
	experimentName: 'specs.thunderbolt.pinned_layout_css_catharsis',
	renderableNodes: { pinnedStyle },
	intermediateNodes: {},
	dataMaps: ['component_properties'],
	domApplier: pinnedLayoutDomApplier,
}
