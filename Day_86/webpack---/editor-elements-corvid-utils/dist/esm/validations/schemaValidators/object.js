import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';
import {
    messages
} from '../../messages';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;
export function validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams) {
    if (!assert.isObject(value)) {
        return ValidationResult.InvalidType;
    }
    if (schema.required) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let propNameIdx = 0; propNameIdx < schema.required.length; propNameIdx++) {
            if (!hasOwnProperty.call(value, schema.required[propNameIdx])) {
                reportError(messages.missingFieldMessage({
                    functionName: messageParams.functionName,
                    index: messageParams.index,
                    propertyName: schema.required[propNameIdx],
                }), Object.assign(Object.assign({}, messageParams), {
                    value
                }));
                return ValidationResult.Invalid;
            }
        }
    }
    if (schema.properties) {
        const propNames = getOwnPropertyNames(schema.properties);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            const propName = propNames[propNameIdx];
            if (hasOwnProperty.call(value, propName)) {
                const propSchema = schema.properties[propName];
                const propValue = value[propName]; // hmmm...
                if (!validateSchema(propValue, propSchema, {
                        functionName: messageParams.functionName,
                        index: messageParams.index,
                        propertyName: propName,
                    })) {
                    return ValidationResult.Invalid;
                }
            }
        }
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=object.js.map