import { Component } from '@wix/thunderbolt-becky-types'
import { createCssCompNode } from '../cssCompNode'
import { toCompVariants } from '../../utils/toCompVariants'
import { FeatureRefs } from '../cssFeatures.types'

export const layoutVariants = createCssCompNode('responsiveLayout', 'layoutVariants', {
	getDependencies: (component: Component, refs: FeatureRefs<'responsiveLayout'>) =>
		component.layoutQuery ? refs.layoutQuery(component.layoutQuery) : null,
	toViewItem: (__, layoutRefArray) => {
		if (!layoutRefArray || layoutRefArray.type !== 'RefArray') {
			return null
		}

		return toCompVariants(layoutRefArray.values)
	},
})
