import _ from 'lodash'
import { getSchemaOfAnimation, animationOptionsMappings, EASING_MAP } from './animationSchemas'
import { isValueInPattern, isValueInRange, validateByType } from './validationUtils'
import {
	AnimationAttributes,
	AnimationParams,
	OffsetOptions,
	OffsetParams,
	TimelineOptions,
	TimelineParams,
	ParamValue,
} from '../../types'
import { reportInvalidAnimationName, reportInvalidKeys, reportInvalidOptionsValue } from '../reporter/errorReport'

export const validateTimelineParams = (timelineOptions: TimelineOptions = {}, timelineId: string) => {
	const timelineParams = filterInvalidAnimationParams('timeline', timelineOptions, timelineId) as TimelineOptions
	return buildAnimationParams('timeline', timelineParams) as TimelineParams
}

const validateSingleParam = (value: ParamValue, schema: any): boolean => {
	// If oneOf, run through schemas and pass if one schema passes.
	if (schema.oneOf) {
		return _.some(schema.oneOf, (oneOfSchema) => validateSingleParam(value, oneOfSchema))
	}

	// If type mismatch, fail
	if (schema.type && !validateByType({ value, expectedType: schema.type })) {
		return false
	}

	// Test value validity
	if (schema.enum) {
		return _.includes(schema.enum, value)
	} else if (schema.pattern) {
		return isValueInPattern({ value, pattern: schema.pattern })
	} else if (schema.range) {
		const { minValue = Number.MIN_SAFE_INTEGER, maxValue = Number.MAX_SAFE_INTEGER } = schema.range
		return isValueInRange({ value, minValue, maxValue })
	}

	return true
}

export const filterInvalidAnimationParams = (
	animationName: string,
	animationParams: AnimationAttributes | TimelineOptions | OffsetOptions,
	compNickname: string
) => {
	const animationSchema = getSchemaOfAnimation(animationName)
	// If no schema than this animation name is not supported, report
	if (!animationSchema) {
		reportInvalidAnimationName(animationName, compNickname)
		return {}
	}

	// check if passed animation params are valid, report invalid
	const invalidKeys = _.difference(_.keys(animationParams), _.keys(animationSchema.validations))
	reportInvalidKeys(invalidKeys, compNickname)

	// Omit invalid params
	const validParams = _.omit(animationParams, invalidKeys)

	// Pick valid params
	return _.pickBy(validParams, (value, key) => {
		const schema = animationSchema.validations[key]
		const valid = validateSingleParam(value as ParamValue, schema)
		if (!valid) {
			reportInvalidOptionsValue(value, key, compNickname)
		}
		return valid
	}) as AnimationAttributes | TimelineOptions | OffsetOptions
}

const convertNumberLikeMsToSecs = (value: string | number) => {
	if (_.isNumber(value)) {
		return value / 1000
	}
	return value.replace(/\d+/, (num) => `${+num / 1000}`)
}

export const buildAnimationParams = (
	animationName: string,
	animationOptions: AnimationAttributes | TimelineOptions | OffsetOptions
): AnimationParams | TimelineParams | OffsetParams => {
	const animationSchema = getSchemaOfAnimation(animationName)

	const params = _.reduce(
		animationOptions,
		(acc, value, key) => {
			const path = _.get(animationOptionsMappings, ['keys', key], key)
			const newValue = _.get(animationOptionsMappings, ['values', key, 'convertMsToSecs'])
				? convertNumberLikeMsToSecs(value!)
				: value
			// using set to convert strings in the form of 'to.x' to and object path
			_.set(acc, path, newValue)
			return acc
		},
		{ ...animationSchema.default }
	)

	if (params.ease) {
		params.ease = EASING_MAP[params.ease]
	}

	return params
}
