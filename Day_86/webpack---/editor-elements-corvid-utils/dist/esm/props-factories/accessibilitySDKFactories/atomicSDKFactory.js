import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const atomicSDKFactory = ({
    setProps,
    props
}) => ({
    get atomic() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.atomic;
    },
    set atomic(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                atomic: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createAtomicSDK = withValidation(atomicSDKFactory, {
    type: ['object'],
    properties: {
        atomic: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=atomicSDKFactory.js.map