import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const liveSDKFactory = ({
    setProps,
    props
}) => ({
    get live() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.live;
    },
    set live(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                live: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createLiveSDK = withValidation(liveSDKFactory, {
    type: ['object'],
    properties: {
        live: {
            type: ['string'],
            enum: ['polite', 'assertive'],
        },
    },
});
//# sourceMappingURL=liveSDKFactory.js.map