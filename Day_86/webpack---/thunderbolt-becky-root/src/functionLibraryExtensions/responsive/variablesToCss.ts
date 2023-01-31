import {
	ItemsAlignmentValue,
	JustifyContentValue,
	UnitSizeValue,
	VariablesValues,
	NumberValue,
} from '@wix/thunderbolt-becky-types'
import {
	unitSizeToString,
	gridAlignmentToString,
	flexAlignmentToString,
	flexJustifyContentToString,
	numberToString,
} from './layoutValuesToCss'

export const isUnitSizeValue = (value: VariablesValues): value is UnitSizeValue => value.type === 'UnitSizeValue'
export const isItemsAlignmentValue = (value: VariablesValues): value is ItemsAlignmentValue =>
	value.type === 'ItemsAlignmentValue'
export const isJustifyContentValue = (value: VariablesValues): value is JustifyContentValue =>
	value.type === 'JustifyContentValue'
export const isNumberValue = (value: VariablesValues): value is NumberValue => value.type === 'NumberValue'

const getBaseVarName = (varId: string) => `--${varId}`

const getVarNameWithSuffix = (varId: string, suffix: string) => `${getBaseVarName(varId)}-${suffix}`

export const variableNameGetters = {
	unitSize: {
		get: (varId: string) => getBaseVarName(varId),
	},
	alignment: {
		getForGrid: (varId: string) => getVarNameWithSuffix(varId, 'grid'),
		getForFlex: (varId: string) => getVarNameWithSuffix(varId, 'flex'),
	},
	justifyContent: {
		get: (varId: string) => getBaseVarName(varId),
	},
	number: {
		get: (varId: string) => getBaseVarName(varId),
	},
}

export const getVariableCss = (varValue: VariablesValues, varId: string): Record<string, string> => {
	if (isUnitSizeValue(varValue)) {
		return { [variableNameGetters.unitSize.get(varId)]: unitSizeToString(varValue.value) }
	}

	if (isItemsAlignmentValue(varValue)) {
		return {
			[variableNameGetters.alignment.getForGrid(varId)]: gridAlignmentToString(varValue.value),
			[variableNameGetters.alignment.getForFlex(varId)]: flexAlignmentToString(varValue.value),
		}
	}

	if (isJustifyContentValue(varValue)) {
		return {
			[variableNameGetters.justifyContent.get(varId)]: flexJustifyContentToString(varValue.value),
		}
	}

	if (isNumberValue(varValue)) {
		return { [variableNameGetters.number.get(varId)]: numberToString(varValue.value) }
	}

	return {}
}
