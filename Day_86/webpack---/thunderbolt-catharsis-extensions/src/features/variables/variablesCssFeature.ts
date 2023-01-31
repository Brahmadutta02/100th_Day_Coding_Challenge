import { variablesDomApplier } from './variablesDomApplier'
import { variables } from './variablesCompNode'
import { variablesVariants } from './variablesVariantsCompNode'
import { VariablesCssFeature } from './variables.types'

export const variablesCssFeature: VariablesCssFeature = {
	experimentName: 'specs.thunderbolt.new_responsive_layout',
	renderableNodes: { variables, variablesVariants },
	intermediateNodes: {},
	dataMaps: ['variables'],
	domApplier: variablesDomApplier,
}
