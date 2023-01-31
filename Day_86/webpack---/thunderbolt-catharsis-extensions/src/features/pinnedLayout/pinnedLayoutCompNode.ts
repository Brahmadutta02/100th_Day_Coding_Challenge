import { createCssCompNode } from '../cssCompNode'
import { FeatureRefs } from '../cssFeatures.types'
import { SelectorObj } from '../../shared.types'
import { PinnedStyle } from './pinnedLayout.types'
import { Component, AbsoluteLayout, TPAGluedWidgetProperties } from '@wix/thunderbolt-becky-types'
import { DockedCompLayout, getDockedStyles } from '@wix/thunderbolt-becky-root'
import { mapValues, mapKeys, kebabCase } from 'lodash'
import { fixTPAGluedWidgetLayout } from './TPAGluedWidgetLayoutFixer'
import { getRegularIdSelector } from '../../utils/selectorsUtils'
import { hasResponsiveLayout } from '../../utils/hasResponsiveLayout'

const PAGE_COMPS = ['MasterPage', 'Page', 'PopupContainer']

const isPinned = (compLayout: AbsoluteLayout) => compLayout && compLayout.fixedPosition && !!compLayout.docked
const isDockedCompLayout = (pinnedStyle: PinnedStyle): pinnedStyle is DockedCompLayout =>
	!!pinnedStyle && 'id' in pinnedStyle

const computeDockedStyles = (childrenDockedLayout: Array<PinnedStyle>): SelectorObj | null => {
	const dockedLayouts = childrenDockedLayout.filter(isDockedCompLayout)
	if (!dockedLayouts.length) {
		return null
	}
	const pinnedComponentsStylesMap = getDockedStyles(dockedLayouts, false, false)
	const pinnedComponentsCssMap = mapValues(pinnedComponentsStylesMap, (cssObj) =>
		mapKeys(cssObj, (__, key) => kebabCase(key))
	)
	const selectorToCssMap = mapKeys(pinnedComponentsCssMap, (__, compId) => getRegularIdSelector(compId))

	return selectorToCssMap
}

const getDockedLayout = (compId: string, compLayout: AbsoluteLayout): DockedCompLayout | null => {
	if (!isPinned(compLayout)) {
		return null
	}

	const { x: left, y: top, width, height, docked = {}, fixedPosition, rotationInDegrees } = compLayout

	return {
		id: compId,
		left,
		top,
		width,
		height,
		docked,
		isFixed: fixedPosition,
		rotationInDegrees,
	}
}

export const pinnedStyle = createCssCompNode('pinnedLayout', 'pinnedStyle', {
	getDependencies: (component: Component, refs: FeatureRefs<'pinnedLayout'>) => {
		// only direct children of Page or PopupContainer can be pinned components
		const isPageComp = PAGE_COMPS.includes(component.componentType)
		if (isPageComp) {
			return { childrenDockedLayout: (component.components || []).map(refs.pinnedStyle) }
		}
		if (component.componentType === 'TPAGluedWidget') {
			// TPAGluedWidget has to be translated to pinnedLayout according to its props
			return { compProps: refs.propertyQuery<TPAGluedWidgetProperties>(component.propertyQuery!) }
		}
		return null
	},
	toViewItem: (component: Component, deps): PinnedStyle => {
		// only classic non-responsive layout
		if (hasResponsiveLayout(component)) {
			return null
		}

		// only direct children of Page or PopupContainer can have pinned style
		if (deps?.childrenDockedLayout) {
			const selectorToCssMap = computeDockedStyles(deps.childrenDockedLayout)
			return selectorToCssMap
				? {
						type: 'SelectorObj',
						selectorObj: selectorToCssMap,
				  }
				: null
		}

		const compLayout = deps?.compProps
			? fixTPAGluedWidgetLayout(component.layout, deps.compProps)
			: component.layout

		return getDockedLayout(component.id, compLayout as AbsoluteLayout)
	},
})
