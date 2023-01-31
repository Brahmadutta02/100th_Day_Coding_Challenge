import { BaseDataItem, Component, LayoutDataItems, SingleLayoutData } from '@wix/thunderbolt-becky-types'
import { REDUCE_FUNCTIONS, toBreakpointVariantsMap } from '../../utils/toBreakpointVariantsMap'
import { createCssCompNode } from '../cssCompNode'
import { FeatureRefs } from '../cssFeatures.types'

const isSingleLayoutData = (item: BaseDataItem): item is SingleLayoutData => item.type === 'SingleLayoutData'

const getItemLayouts = (item: LayoutDataItems): Array<LayoutDataItems> => {
	if (!isSingleLayoutData(item)) {
		return [item]
	}
	const res = []
	if (item.componentLayout?.type) {
		res.push(item.componentLayout)
	}
	if (item.containerLayout?.type) {
		res.push(item.containerLayout)
	}
	if (item.itemLayout?.type) {
		res.push(item.itemLayout)
	}
	return res
}

export const compLayouts = createCssCompNode('responsiveLayout', 'compLayouts', {
	getDependencies: (component: Component, refs: FeatureRefs<'responsiveLayout'>) =>
		component.layoutQuery ? refs.layoutQuery(component.layoutQuery) : null,
	toViewItem: (__, refArray) => {
		if (!refArray || refArray.type !== 'RefArray') {
			return null
		}
		return toBreakpointVariantsMap(refArray.values, getItemLayouts, REDUCE_FUNCTIONS.concat)
	},
})
