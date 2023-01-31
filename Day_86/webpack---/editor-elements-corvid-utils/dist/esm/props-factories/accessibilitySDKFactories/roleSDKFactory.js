import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const roleSDKFactory = ({
    setProps,
    props,
}) => ({
    get role() {
        return props.role;
    },
    set role(value) {
        setProps({
            role: isEmptyValue(value) ? undefined : value,
        });
    },
});
export const createRoleSDK = withValidation(roleSDKFactory, {
    type: ['object'],
    properties: {
        role: {
            type: ['string'],
        },
    },
});
//# sourceMappingURL=roleSDKFactory.js.map