import { assign } from 'lodash'
import { Component } from '@wix/thunderbolt-becky-types'
import { getVariableCss } from '@wix/thunderbolt-becky-root'
import { createCssCompNode } from '../cssCompNode'
import { VariablesCssData } from './variables.types'
import { getVariant } from '../../utils/toBreakpointVariantsMap'
import { FeatureRefs } from '../cssFeatures.types'

export const variables = createCssCompNode('variables', 'variables', {
	getDependencies: (component: Component, refs: FeatureRefs<'variables'>) =>
		component.variablesQuery ? refs.variablesQuery(component.variablesQuery) : null,
	toViewItem: (component, variablesList): VariablesCssData | null => {
		if (!variablesList || !variablesList.variables) {
			return null
		}

		return variablesList.variables.reduce<VariablesCssData>((acc, { id: varId, value: refArray }) => {
			refArray.values.forEach((val) => {
				const { breakpointId, variantsKey, value } = getVariant(val)
				acc[breakpointId] = acc[breakpointId] || {}
				acc[breakpointId][variantsKey] = acc[breakpointId][variantsKey] || {}
				assign(acc[breakpointId][variantsKey], getVariableCss(value, varId))
			})

			return acc
		}, {})
	},
})
