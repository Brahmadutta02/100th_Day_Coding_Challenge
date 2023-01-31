import {
    withValidation
} from '../validations';
import {
    registerCorvidKeyboardEvent,
    registerCorvidEvent,
} from '../corvidEvents';
const _textInputPropsSDKFactory = api => {
    return {
        get placeholder() {
            return api.props.placeholder || '';
        },
        set placeholder(value) {
            const placeholder = value || '';
            api.setProps({
                placeholder
            });
        },
        get maxLength() {
            return api.props.maxLength;
        },
        set maxLength(value) {
            const maxLength = value === null || value === undefined ? null : value;
            api.setProps({
                maxLength
            });
        },
        onKeyPress: handler => registerCorvidKeyboardEvent('onKeyPress', api, handler),
        onInput: handler => registerCorvidEvent('onInput', api, handler),
    };
};
export const textInputPropsSDKFactory = withValidation(_textInputPropsSDKFactory, {
    type: ['object'],
    properties: {
        placeholder: {
            type: ['string', 'nil'],
            warnIfNil: true,
        },
        maxLength: {
            type: ['integer', 'nil'],
            warnIfNil: true,
            minimum: 0,
        },
    },
});
//# sourceMappingURL=textInputPropsSDKFactory.js.map