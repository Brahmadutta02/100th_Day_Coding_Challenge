import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const roleDescriptionSDKFactory = ({
    setProps,
    props
}) => ({
    get roleDescription() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.roleDescription;
    },
    set roleDescription(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                roleDescription: isEmptyValue(value) ? undefined : value
            }),
        });
    },
});
export const createRoleDescriptionSDK = withValidation(roleDescriptionSDKFactory, {
    type: ['object'],
    properties: {
        roleDescription: {
            type: ['string'],
            minLength: 1,
            maxLength: 100,
        },
    },
});
//# sourceMappingURL=roleDescriptionSDKFactory.js.map