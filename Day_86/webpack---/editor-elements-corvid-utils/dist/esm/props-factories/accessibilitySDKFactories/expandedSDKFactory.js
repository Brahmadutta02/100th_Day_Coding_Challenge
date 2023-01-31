import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const expandedSDKFactory = ({
    setProps,
    props
}) => ({
    get expanded() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.expanded;
    },
    set expanded(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                expanded: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createExpandedSDK = withValidation(expandedSDKFactory, {
    type: ['object'],
    properties: {
        expanded: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=expandedSDKFactory.js.map