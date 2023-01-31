import {
    withValidation
} from '../validations';
const _checkedPropsSDKFactory = (inputValidator) => api => {
    const {
        props,
        setProps
    } = api;
    return {
        get checked() {
            return props.checked || false;
        },
        set checked(value) {
            setProps({
                checked: value || false
            });
            inputValidator.validate({
                viewerSdkAPI: api,
                showValidityIndication: true,
            });
        },
    };
};
export const createCheckedPropsSDKFactory = (inputValidator) => withValidation(_checkedPropsSDKFactory(inputValidator), {
    type: ['object'],
    properties: {
        checked: {
            type: ['boolean', 'nil'],
        },
    },
});
//# sourceMappingURL=checkedPropsSDKFactory.js.map