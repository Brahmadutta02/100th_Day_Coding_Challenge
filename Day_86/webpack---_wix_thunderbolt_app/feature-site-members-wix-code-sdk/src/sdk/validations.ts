import _ from 'lodash'

const TYPES = {
	NUMBER: 'number',
	STRING: 'string',
	STRING_ARRAY: 'string array',
	BOOLEAN: 'boolean',
	OBJECT: 'object',
	UUID: 'uuid',
}
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const validateEmailUserParams = (emailId: any, toUser: any, options?: any) => {
	const typeRules = [
		{ acceptNil: false, propertyName: 'emailId', value: emailId, expectedType: 'string' },
		{ acceptNil: false, propertyName: 'toUser', value: toUser, expectedType: 'uuid' },
		{ acceptNil: true, propertyName: 'options', value: options, expectedType: 'object' },
	]
	const errorSuffix = 'For more information visit https://www.wix.com/velo/reference/wix-crm/emailcontact'
	validate(typeRules, errorSuffix)

	let processedOptions
	if (options) {
		processedOptions = _.cloneDeep(options)
		const { variables } = options
		if (variables.constructor !== Object) {
			throw new Error('"variables" in options parameter must be an object.')
		}

		if (variables) {
			for (const key in variables) {
				if (!Object.prototype.hasOwnProperty.call(variables, key)) {
					continue
				}
				const value = options.variables[key]
				if (typeof value === 'boolean' || typeof value === 'number') {
					processedOptions.variables[key] = value.toString()
				} else if (typeof value !== 'string' && !(value instanceof String)) {
					throw new Error(
						`variable "${key}" value must be string. For more information visit https://www.wix.com/velo/reference/wix-crm/emailcontact`
					)
				}
			}
		}
	}
	return {
		processedOptions,
	}
}

const validate = (
	typeRules: Array<{ propertyName: string; value: any; expectedType: string; acceptNil: boolean }>,
	errorSuffix = ''
) => {
	typeRules.forEach(({ propertyName, value, expectedType, acceptNil }) => {
		if (!validateByType({ value, expectedType, acceptNil })) {
			throw new Error(typeError(propertyName, expectedType, errorSuffix))
		}
	})
}

function validateByType({ value, expectedType, acceptNil }: { value: any; expectedType: string; acceptNil: boolean }) {
	if (_.isNil(value) && acceptNil) {
		return true
	}
	switch (expectedType) {
		case TYPES.NUMBER:
			return _.isNumber(value) && !_.isNaN(value)
		case TYPES.STRING:
			return _.isString(value)
		case TYPES.STRING_ARRAY:
			return _.isArray(value) && _.every(value, (val) => _.isString(val))
		case TYPES.BOOLEAN:
			return _.isBoolean(value)
		case TYPES.OBJECT:
			return _.isObject(value) && !_.isArray(value) && !_.isFunction(value)
		case TYPES.UUID:
			return uuidV4Regex.test(value)

		default:
			return true
	}
}

export const typeError = (propertyName: string, expectedType: string, errorSuffix: string) =>
	`variable "${propertyName}" value must be ${expectedType}. ${errorSuffix}`
