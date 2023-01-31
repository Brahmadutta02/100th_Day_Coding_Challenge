import {
    withValidation
} from '../..';
import {
    createTextElementValidator
} from './accessibilityUtils/validators';
const errorMessageSDKFactory = ({
    setProps,
    props,
    create$w
}) => ({
    get errorMessage() {
        var _a;
        if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.errorMessage)) {
            return undefined;
        }
        const $w = create$w();
        return $w(`#${props.ariaAttributes.errorMessage}`);
    },
    set errorMessage(selector) {
        if (!selector) {
            setProps({
                ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                    errorMessage: undefined
                }),
            });
            return;
        }
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                errorMessage: selector.uniqueId
            }),
        });
    },
});
const customRules = {
    errorMessage: [createTextElementValidator('errorMessage')],
};
export const createErrorMessageSDK = withValidation(errorMessageSDKFactory, {
    type: ['object'],
    properties: {
        errorMessage: {
            type: ['object', 'nil'],
        },
    },
}, customRules);
//# sourceMappingURL=errorMessageSDKFactory.js.map