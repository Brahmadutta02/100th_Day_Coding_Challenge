import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';
import {
    messages
} from '../../messages';
export function validateNumber(value, schema, reportError, messageParams) {
    const {
        minimum,
        maximum,
        enum: enumArray
    } = schema;
    if (!assert.isNumber(value)) {
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
    if ((assert.isNumber(minimum) && assert.isBelow(value, minimum)) ||
        (assert.isNumber(maximum) && assert.isAbove(value, maximum))) {
        reportError(messages.invalidNumberBoundsMessage(Object.assign({
            value,
            minimum: minimum, // either minimum or maximum are numbers here
            maximum
        }, messageParams)), Object.assign(Object.assign({}, messageParams), {
            value
        }));
        return ValidationResult.Invalid;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=number.js.map