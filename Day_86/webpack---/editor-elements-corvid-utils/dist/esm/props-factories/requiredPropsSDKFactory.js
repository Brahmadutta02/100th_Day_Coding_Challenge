import {
    withValidation
} from '../validations';
const _requiredPropsSDKFactory = (inputValidator) => api => ({
    get required() {
        return api.props.required || false;
    },
    set required(value) {
        api.setProps({
            required: value
        });
        inputValidator.validate({
            viewerSdkAPI: api,
            showValidityIndication: true,
        });
    },
});
export const createRequiredPropsSDKFactory = (inputValidator) => withValidation(_requiredPropsSDKFactory(inputValidator), {
    type: ['object'],
    properties: {
        required: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=requiredPropsSDKFactory.js.map