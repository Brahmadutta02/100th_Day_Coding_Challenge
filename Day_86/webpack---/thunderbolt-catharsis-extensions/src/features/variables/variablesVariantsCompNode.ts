import type { Component } from '@wix/thunderbolt-becky-types'
import { toCompVariants } from '../../utils/toCompVariants'
import { createCssCompNode } from '../cssCompNode'
import { UnitSizeVarViewItem } from '@wix/thunderbolt-catharsis'
import { FeatureRefs } from '../cssFeatures.types'

export const variablesVariants = createCssCompNode('variables', 'variablesVariants', {
	getDependencies: (component: Component, refs: FeatureRefs<'variables'>) =>
		component.variablesQuery ? refs.variablesQuery(component.variablesQuery) : null,
	toViewItem: (__, variablesList) => {
		if (!variablesList || !variablesList.variables) {
			return null
		}

		const variablesRefArray = (variablesList.variables as Array<UnitSizeVarViewItem>).flatMap((v) => v.value.values)

		return toCompVariants(variablesRefArray)
	},
})
