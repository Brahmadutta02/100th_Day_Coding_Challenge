import { transitions } from './transitionsCompNode'
import { transitionsVariants } from './transitionsVariantsCompNode'
import type { TransitionsCssFeature } from './transitions.types'
import { transitionsDomApplier } from './transitionsDomApplier'

export const transitionsCssFeature: TransitionsCssFeature = {
	experimentName: 'specs.thunderbolt.catharsis_transitions_style',
	renderableNodes: { transitionsVariants, transitions },
	intermediateNodes: {},
	dataMaps: ['variants_data', 'transitions_data'],
	domApplier: transitionsDomApplier,
}
