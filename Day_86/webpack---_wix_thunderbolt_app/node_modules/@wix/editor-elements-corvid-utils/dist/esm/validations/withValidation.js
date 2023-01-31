import {
    reportError,
    reportWarning
} from '../reporters';
import {
    createSchemaValidator
} from './createSchemaValidator';
export function createCompSchemaValidator(compName, {
    suppressIndexErrors = false
} = {}) {
    return createSchemaValidator({
        reportError,
        reportWarning
    }, compName, {
        suppressIndexErrors,
    });
}
export function withValidation(sdkFactory, schema, rules = {}) {
    return (api) => {
        const sdk = sdkFactory(api);
        const schemaValidator = createCompSchemaValidator(api.metaData.role);
        const argsSchemaValidator = createCompSchemaValidator(api.metaData.role, {
            suppressIndexErrors: true,
        });
        const sdkWithValidation = Object.keys(sdk).reduce((acc, sdkPropName) => {
            const propDesc = Object.getOwnPropertyDescriptor(sdk, sdkPropName);
            const propWithValidationDesc = {
                // retrieve value from sdk
                enumerable: true,
                configurable: true,
            };
            // data descriptor (functions, variables)
            if (propDesc.value) {
                if (typeof propDesc.value === 'function') {
                    propWithValidationDesc.value = (...args) => {
                        const argsSchema = schema.properties[sdkPropName] &&
                            schema.properties[sdkPropName].args;
                        const customValidation = rules[sdkPropName];
                        let isValid = true;
                        if (argsSchema) {
                            isValid = argsSchemaValidator(args, {
                                type: ['array'],
                                items: argsSchema
                            }, sdkPropName);
                        }
                        if (isValid && customValidation) {
                            isValid = customValidation.every(p => p(args, api));
                        }
                        return isValid ? propDesc.value(...args) : undefined;
                    };
                } else {
                    // delegate assignment to sdk
                    propWithValidationDesc.value = propDesc.value;
                }
            }
            // accessor descriptor
            else {
                if (propDesc.get) {
                    propWithValidationDesc.get = () => sdk[sdkPropName];
                }
                if (propDesc.set) {
                    propWithValidationDesc.set = value => {
                        const customValidation = rules[sdkPropName];
                        let isValid = true;
                        if (schema.properties[sdkPropName]) {
                            isValid = schemaValidator(value, schema.properties[sdkPropName], sdkPropName);
                        }
                        if (isValid && customValidation) {
                            isValid = customValidation.every(p => p(value, api));
                        }
                        if (!isValid) {
                            return;
                        }
                        // delegate assignment to sdk
                        sdk[sdkPropName] = value;
                    };
                }
            }
            Object.defineProperty(acc, sdkPropName, propWithValidationDesc);
            return acc;
        }, {});
        return sdkWithValidation;
    };
}
//# sourceMappingURL=withValidation.js.map