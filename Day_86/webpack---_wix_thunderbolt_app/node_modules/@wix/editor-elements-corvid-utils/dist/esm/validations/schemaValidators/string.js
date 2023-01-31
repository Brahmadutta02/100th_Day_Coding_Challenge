import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';
import {
    messages
} from '../../messages';
export function validateString(value, schema, reportError, messageParams) {
    const {
        minLength,
        maxLength,
        enum: enumArray,
        pattern
    } = schema;
    if (!assert.isString(value)) {
        return ValidationResult.InvalidType;
    }
    if (enumArray && !assert.isIn(value, enumArray)) {
        reportError(messages.invalidEnumValueMessage(Object.assign({
            value,
            enum: enumArray
        }, messageParams)), Object.assign(Object.assign({}, messageParams), {
            value
        }));
        return ValidationResult.Invalid;
    }
    if ((minLength && assert.isBelow(value.length, minLength)) ||
        (maxLength && assert.isAbove(value.length, maxLength))) {
        reportError(messages.invalidStringLengthMessage(Object.assign({
            value,
            minimum: minLength,
            maximum: maxLength
        }, messageParams)), Object.assign(Object.assign({}, messageParams), {
            value
        }));
        return ValidationResult.Invalid;
    }
    if (pattern && !new RegExp(pattern).test(value)) {
        reportError(messages.patternMismatchMessage(Object.assign({
            value
        }, messageParams)), Object.assign(Object.assign({}, messageParams), {
            value
        }));
        return ValidationResult.Invalid;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=string.js.map