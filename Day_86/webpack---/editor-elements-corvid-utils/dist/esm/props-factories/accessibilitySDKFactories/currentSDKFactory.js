import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const currentSDKFactory = ({
    setProps,
    props
}) => ({
    get current() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.current;
    },
    set current(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                current: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createCurrentSDK = withValidation(currentSDKFactory, {
    type: ['object'],
    properties: {
        current: {
            type: ['string'],
            enum: ['step', 'page', 'true', 'false', 'location', 'date', 'time'],
        },
    },
});
//# sourceMappingURL=currentSDKFactory.js.map