import _ from 'lodash'

const TYPES = {
	NUMBER: 'number',
	STRING: 'string',
	BOOLEAN: 'boolean',
	DATE: 'date',
	FUNCTION: 'function',
	ARRAY: 'array',
	OBJECT: 'object',
	URL: 'url',
	INTEGER: 'integer',
	UUID: 'uuid',
}

export const validateByType = ({ value, expectedType }: { value: any; expectedType: string }) => {
	switch (expectedType) {
		case TYPES.NUMBER:
			return _.isNumber(value) && !_.isNaN(value)
		case TYPES.STRING:
			return _.isString(value)
		case TYPES.BOOLEAN:
			return _.isBoolean(value)
		case TYPES.DATE:
			return _.isDate(value) && !_.isNaN(value.getTime())
		case TYPES.FUNCTION:
			return _.isFunction(value)
		case TYPES.ARRAY:
			return _.isArray(value)
		case TYPES.OBJECT:
			return _.isObject(value) && !_.isArray(value) && !_.isFunction(value)
		case TYPES.INTEGER:
			return _.isInteger(value)
		default:
			return true
	}
}

const isActualNumber = (value: any) => {
	return _.isNumber(value) && !_.isNaN(value)
}

export const isValueInRange = ({
	value,
	minValue,
	maxValue,
	acceptNil = false,
}: {
	value: any
	minValue: any
	maxValue: any
	acceptNil?: boolean
}) => {
	if (acceptNil && _.isNil(value)) {
		return true
	}
	return (
		isActualNumber(maxValue) &&
		isActualNumber(value) &&
		isActualNumber(minValue) &&
		maxValue >= value &&
		value >= minValue
	)
}

export const isValueInPattern = ({
	value,
	pattern,
	acceptNil = false,
}: {
	value: any
	pattern: RegExp
	acceptNil?: boolean
}) => {
	if (acceptNil && _.isNil(value)) {
		return true
	}

	return Boolean(typeof value === 'string' && value.match(pattern))
}
