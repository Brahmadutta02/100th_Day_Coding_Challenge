import { Component, AnimationsBehavior } from '@wix/thunderbolt-becky-types'
import { createCssCompNode } from '../cssCompNode'
import { FeatureRefs } from '../cssFeatures.types'
import { envRefs } from '@wix/thunderbolt-catharsis'

export const hasScreenIn = createCssCompNode('screenIn', 'hasScreenIn', {
	getDependencies: (component: Component, refs: FeatureRefs<'screenIn'>) =>
		component.behaviorQuery
			? {
					behavior: refs.behaviorQuery(component.behaviorQuery),
					viewMode: envRefs.viewMode,
					showScreenInComp: envRefs.showScreenInComp,
			  }
			: null,
	toViewItem: (__, deps) => {
		if (!deps || deps.showScreenInComp) {
			return false
		}

		const { behavior, viewMode } = deps

		if (!behavior) {
			return false
		}

		const items: Array<AnimationsBehavior> = JSON.parse(behavior.items)

		return items.some(
			(item) => item.action === 'screenIn' && (!item.viewMode || item.viewMode.toLowerCase() === viewMode)
		)
	},
})
