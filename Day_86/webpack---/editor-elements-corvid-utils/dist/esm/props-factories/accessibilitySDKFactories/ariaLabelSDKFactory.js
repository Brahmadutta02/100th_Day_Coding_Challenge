import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const ariaLabelSDKFactory = ({
    setProps,
    props
}) => ({
    get label() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.label;
    },
    set label(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                label: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createAriaLabelSDK = withValidation(ariaLabelSDKFactory, {
    type: ['object'],
    properties: {
        label: {
            type: ['string'],
            minLength: 1,
            maxLength: 1000,
        },
    },
});
//# sourceMappingURL=ariaLabelSDKFactory.js.map