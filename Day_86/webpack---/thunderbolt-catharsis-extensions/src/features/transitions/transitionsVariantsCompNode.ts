import type { Component } from '@wix/thunderbolt-becky-types'
import type { FeatureRefs } from '../cssFeatures.types'
import { createCssCompNode } from '../cssCompNode'
import { toCompVariants } from '../../utils/toCompVariants'
import { isRefArray } from '../../utils/variantsUtils'

export const transitionsVariants = createCssCompNode('transitions', 'transitionsVariants', {
	getDependencies: (component: Component, refs: FeatureRefs<'transitions'>) =>
		component.transitionQuery ? refs.transitionQuery(component.transitionQuery) : undefined,
	toViewItem: (__, transitionRefArray) => {
		if (!isRefArray(transitionRefArray)) {
			return null
		}

		return toCompVariants(transitionRefArray.values)
	},
})
