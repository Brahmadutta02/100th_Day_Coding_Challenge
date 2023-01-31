import { pinnedLayerDataItemToCss } from '@wix/thunderbolt-becky-root'
import { Component } from '@wix/thunderbolt-becky-types'
import { mapValues, merge } from 'lodash'
import { createCssCompNode } from '../cssCompNode'
import { SelectorObj } from '../../shared.types'
import { FeatureRefs } from '../cssFeatures.types'

export const pinnedLayer = createCssCompNode('responsiveLayout', 'pinnedLayer', {
	getDependencies: (component: Component, refs: FeatureRefs<'responsiveLayout'>) => refs.compLayouts(component),
	toViewItem: (__, breakpointsToLayouts) => {
		if (!breakpointsToLayouts) {
			return null
		}

		const css = mapValues(breakpointsToLayouts, (variantsToLayouts) =>
			mapValues(variantsToLayouts, (layoutDataItems) => {
				const itemsCss = layoutDataItems.map((item) =>
					item.type === 'FixedItemLayout' ? pinnedLayerDataItemToCss(item) : null
				)
				const mergedCss: SelectorObj = merge({}, ...itemsCss)
				return mergedCss
			})
		)

		return css
	},
})
