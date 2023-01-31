import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    withValidation,
    createCompSchemaValidator,
} from '../validations';
import {
    changePropsSDKFactory,
} from './changePropsSDKFactory';
const _createValuePropsSDKFactory = (valueSanitizer, valueSchema, inputValidator) => api => {
    const {
        setProps,
        props,
        metaData
    } = api;
    const schemaValidator = createCompSchemaValidator(metaData.role);
    return {
        get value() {
            return props.value;
        },
        set value(value) {
            const sanitizedValue = valueSanitizer(value, api);
            const isValid = schemaValidator(sanitizedValue, valueSchema, 'value');
            if (!isValid) {
                return;
            }
            setProps({
                value: sanitizedValue
            });
            inputValidator.validate({
                viewerSdkAPI: api,
                showValidityIndication: true,
            });
        },
    };
};
export const createValuePropsSdkFactory = (valueSanitizer, valueSchema, inputValidator) => composeSDKFactories(changePropsSDKFactory, withValidation(_createValuePropsSDKFactory(valueSanitizer, valueSchema, inputValidator), {
    type: ['object'],
    properties: {},
}));
//# sourceMappingURL=valuePropsSDKFactory.js.map