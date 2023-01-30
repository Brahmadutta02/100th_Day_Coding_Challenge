import _ from 'lodash'
import {
    logSdkError
} from '@wix/thunderbolt-commons'
import {
    error_length_accept_single_value,
    error_length_exceeds,
    error_length_in_range
} from './errors'

export const TYPES = {
    NUMBER: 'number',
    STRING: 'string',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
}

export function validateByType({
    value,
    expectedType,
    acceptNil
}) {
    if (_.isNil(value) && acceptNil) {
        return true
    }
    switch (expectedType) {
        case TYPES.NUMBER:
            return _.isNumber(value) && !_.isNaN(value)
        case TYPES.STRING:
            return _.isString(value)
        case TYPES.BOOLEAN:
            return _.isBoolean(value)
        case TYPES.OBJECT:
            return _.isObject(value) && !_.isArray(value) && !_.isFunction(value)
        default:
            return true
    }
}

export function validateLength({
    propertyName,
    value,
    minLength,
    maxLength,
    functionName
}) {
    const valid = isValueInRange({
        value: _.get(value, 'length'),
        minValue: minLength,
        maxValue: maxLength,
    })
    if (!valid) {
        logSdkError(
            getLengthError({
                minLength,
                maxLength
            })({
                functionName,
                propertyName,
                wrongValue: value,
                minLength,
                maxLength,
                acceptedLength: maxLength,
            })
        )
    }
    return valid
}

export function getLengthError({
    minLength,
    maxLength
}) {
    let error = error_length_in_range
    if (!isActualNumber(minLength) || !isActualNumber(maxLength)) {
        return error
    }

    if (minLength === maxLength) {
        error = error_length_accept_single_value
    } else if (minLength === 0 && maxLength > 0) {
        error = error_length_exceeds
    }
    return error
}

export function isValueInRange({
    value,
    minValue,
    maxValue,
    acceptNil
}) {
    if (acceptNil && _.isNil(value)) {
        return true
    }
    if (!isActualNumber(maxValue) ||
        !isActualNumber(value) ||
        !isActualNumber(minValue) ||
        maxValue < value ||
        value < minValue
    ) {
        return false
    }
    return true
}

export function isActualNumber(value) {
    return _.isNumber(value) && !_.isNaN(value)
}