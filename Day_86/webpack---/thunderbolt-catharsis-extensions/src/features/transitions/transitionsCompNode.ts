import type { Component } from '@wix/thunderbolt-becky-types'
import type { FeatureRefs } from '../cssFeatures.types'
import { REDUCE_FUNCTIONS, toBreakpointVariantsMap } from '../../utils/toBreakpointVariantsMap'
import { createCssCompNode } from '../cssCompNode'
import { envRefs } from '@wix/thunderbolt-catharsis'
import { isRefArray } from '../../utils/variantsUtils'

export const transitions = createCssCompNode('transitions', 'transitions', {
	getDependencies: (component: Component, refs: FeatureRefs<'transitions'>) =>
		component.transitionQuery
			? {
					transitionRefArray: refs.transitionQuery(component.transitionQuery),
					componentViewMode: envRefs.componentViewMode,
					enableVariantsTransitionsInEditor: envRefs.enableVariantsTransitionsInEditor,
					viewMode: envRefs.viewMode,
			  }
			: null,
	toViewItem: (component, data) => {
		if (
			!data ||
			!isRefArray(data.transitionRefArray) ||
			data.componentViewMode === 'editor' ||
			!data.enableVariantsTransitionsInEditor ||
			data.viewMode === 'mobile'
		) {
			return null
		}

		const { transitionRefArray } = data

		// the enableVariantsTransitionsInEditor is for preview mode
		return {
			breakpointToTransition: toBreakpointVariantsMap(
				transitionRefArray.values,
				(transitionData) => transitionData,
				REDUCE_FUNCTIONS.last
			),
			componentType: component.componentType,
		}
	},
})
