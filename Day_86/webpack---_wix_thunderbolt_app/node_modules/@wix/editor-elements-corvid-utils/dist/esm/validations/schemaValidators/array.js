import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';

function isTupleSchema(schema) {
    return Array.isArray(schema);
}
export function validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexError = false) {
    if (!assert.isArray(value)) {
        return ValidationResult.InvalidType;
    }
    let isValid = ValidationResult.Valid;
    if (schema.items) {
        const itemsToValidateCount = isTupleSchema(schema.items) ?
            Math.min(value.length, schema.items.length) :
            value.length;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let itemIndex = 0; itemIndex < itemsToValidateCount; itemIndex++) {
            const item = value[itemIndex];
            let itemSchema;
            let propName;
            if (isTupleSchema(schema.items)) {
                itemSchema = schema.items[itemIndex];
                propName = schema.items[itemIndex].name;
            } else {
                itemSchema = schema.items;
                propName = schema.name;
            }
            const isItemValid = validateSchema(item, itemSchema, {
                functionName: messageParams.functionName,
                propertyName: propName || messageParams.propertyName,
                index: !suppressIndexError ? itemIndex : undefined,
            });
            if (!isItemValid) {
                isValid = ValidationResult.Invalid;
            }
        }
    }
    return isValid;
}
//# sourceMappingURL=array.js.map