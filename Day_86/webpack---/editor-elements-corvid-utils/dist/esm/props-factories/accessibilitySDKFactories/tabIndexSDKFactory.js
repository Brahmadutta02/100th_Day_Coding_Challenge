import {
    withValidation
} from '../../validations';
import {
    isEmptyValue
} from './accessibilityUtils/assertions';
const tabIndexSDKFactory = ({
    setProps,
    props
}) => ({
    get tabIndex() {
        return props.tabIndex;
    },
    set tabIndex(value) {
        setProps({
            tabIndex: isEmptyValue(value) ? undefined : value,
        });
    },
});
export const createTabIndexSDK = withValidation(tabIndexSDKFactory, {
    type: ['object'],
    properties: {
        tabIndex: {
            type: ['number'],
            enum: [0, -1],
        },
    },
});
//# sourceMappingURL=tabIndexSDKFactory.js.map