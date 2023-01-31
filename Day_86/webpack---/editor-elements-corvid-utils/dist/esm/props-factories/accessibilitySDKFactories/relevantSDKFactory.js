import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const relevantSDKFactory = ({
    setProps,
    props
}) => ({
    get relevant() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.relevant;
    },
    set relevant(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                relevant: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createRelevantSDK = withValidation(relevantSDKFactory, {
    type: ['object'],
    properties: {
        relevant: {
            type: ['string'],
            enum: ['additions', 'additions text', 'all', 'removals', 'text'],
        },
    },
});
//# sourceMappingURL=relevantSDKFactory.js.map