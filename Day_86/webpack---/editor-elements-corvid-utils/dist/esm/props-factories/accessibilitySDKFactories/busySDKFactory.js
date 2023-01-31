import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const busySDKFactory = ({
    setProps,
    props
}) => ({
    get busy() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.busy;
    },
    set busy(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                busy: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createBusySDK = withValidation(busySDKFactory, {
    type: ['object'],
    properties: {
        busy: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=busySDKFactory.js.map