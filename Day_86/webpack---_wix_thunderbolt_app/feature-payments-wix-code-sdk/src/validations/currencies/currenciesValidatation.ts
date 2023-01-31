import { validateByType, validateLength } from '../validate'
import { logSdkError } from '@wix/thunderbolt-commons'
import { error_type } from '../errors'

export enum TYPES {
	NUMBER = 'number',
	STRING = 'string',
	BOOLEAN = 'boolean',
	OBJECT = 'object',
	ARRAY = 'array',
}

interface TypeRules {
	acceptNil: boolean
	propertyName: string
	value: any
	expectedType: TYPES
	minLength?: number
	maxLength?: number
	itemsType?: TYPES
}

function validate(functionName: string, typeRules: Array<TypeRules>) {
	let valid = true

	typeRules.every(({ propertyName, value, expectedType, acceptNil, minLength, maxLength, itemsType }) => {
		if (typeof minLength === 'number' || typeof maxLength === 'number') {
			if (!validateLength({ propertyName, value, maxLength, minLength, functionName })) {
				valid = false
				return false
			}
			if (itemsType) {
				valid = value.every((itemVal: any) =>
					validateByType({ value: itemVal, expectedType: itemsType, acceptNil: false })
				)
				return false
			}
		} else if (!validateByType({ value, expectedType, acceptNil })) {
			valid = false
			logSdkError(error_type({ propertyName, functionName, wrongValue: value, expectedType }))
			return false
		}

		return valid
	})
	return valid
}

export function validateGetConversionRate(from: string, to: string) {
	const typeRules: Array<TypeRules> = [
		{ acceptNil: false, propertyName: 'from', value: from, expectedType: TYPES.STRING },
		{ acceptNil: false, propertyName: 'to', value: to, expectedType: TYPES.STRING },
	]

	return validate('getConversionRate', typeRules)
}

export function validateConvertAmounts(amounts: Array<number>, from: string, to: string) {
	const typeRules: Array<TypeRules> = [
		{
			acceptNil: false,
			propertyName: 'amounts',
			value: amounts,
			expectedType: TYPES.ARRAY,
			minLength: 1,
			maxLength: 100,
		},
		{ acceptNil: false, propertyName: 'from', value: from, expectedType: TYPES.STRING },
		{ acceptNil: false, propertyName: 'to', value: to, expectedType: TYPES.STRING },
	]

	return validate('convertAmounts', typeRules)
}
