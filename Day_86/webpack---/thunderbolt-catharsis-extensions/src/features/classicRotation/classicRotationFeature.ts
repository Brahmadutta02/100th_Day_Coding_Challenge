import { classicRotation } from './classicRotationCompNode'
import { rotatedComponentsStyleDomApplier } from './classicRotationDomApplier'
import { ClassicRotationFeature } from './classicRotation.types'

export const classicRotationFeature: ClassicRotationFeature = {
	experimentName: 'specs.thunderbolt.rotated_components_style_catharsis',
	renderableNodes: { classicRotation },
	intermediateNodes: {},
	dataMaps: ['layout_data'],
	domApplier: rotatedComponentsStyleDomApplier,
}
