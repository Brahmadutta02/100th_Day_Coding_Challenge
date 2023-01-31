import {
    assert
} from '../assert';
import {
    messages
} from '../messages';
import * as typeValidators from './schemaValidators';
export const ValidationResult = {
    Valid: 'valid',
    Invalid: 'invalid',
    InvalidType: 'invalid-type',
};
export function createSchemaValidator({
    reportError,
    reportWarning
}, compName, {
    suppressIndexErrors = false
} = {}) {
    function validate(value, schema, setterName) {
        return validateSchema(value, schema, {
            functionName: setterName,
            propertyName: setterName,
            /**
             * This intentional? In such a case all errors related to "index"
             * will never be fired
             */
            index: undefined,
        });
    }

    function validateSchema(value, schema, params) {
        if (schema.warnIfNil && assert.isNil(value)) {
            reportWarning(messages.nilAssignmentMessage(Object.assign(Object.assign({}, params), {
                compName
            })), Object.assign(Object.assign({}, params), {
                value
            }));
        }
        let typeIdx = 0;
        for (; typeIdx < schema.type.length; typeIdx++) {
            const validateSchemaForType = validatorsMap[schema.type[typeIdx]];
            const validationResult = validateSchemaForType(value, schema, params);
            if (validationResult !== ValidationResult.InvalidType) {
                return validationResult === ValidationResult.Valid;
            }
        }
        if (typeIdx === schema.type.length) {
            reportError(messages.invalidTypeMessage(Object.assign({
                value,
                types: schema.type
            }, params)), Object.assign(Object.assign({}, params), {
                value
            }));
        }
        return false;
    }
    const validatorsMap = {
        object: (value, schema, messageParams) => {
            return typeValidators.validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams);
        },
        array: (value, schema, messageParams) => {
            return typeValidators.validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexErrors);
        },
        number: (value, schema, messageParams) => {
            return typeValidators.validateNumber(value, schema, reportError, messageParams);
        },
        integer: (value, schema, messageParams) => {
            return typeValidators.validateInteger(value, schema, reportError, messageParams);
        },
        string: (value, schema, messageParams) => {
            return typeValidators.validateString(value, schema, reportError, messageParams);
        },
        boolean: value => {
            return typeValidators.validateBoolean(value);
        },
        date: value => {
            return typeValidators.validateDate(value);
        },
        nil: value => {
            return typeValidators.validateNil(value);
        },
        function: value => {
            return typeValidators.validateFunction(value);
        },
    };
    return validate;
}
//# sourceMappingURL=createSchemaValidator.js.map