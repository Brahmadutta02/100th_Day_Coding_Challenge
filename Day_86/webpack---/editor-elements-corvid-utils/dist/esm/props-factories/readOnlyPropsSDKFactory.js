import {
    withValidation
} from '../validations';
const _readOnlyPropsSDKFactory = ({
    setProps,
    props
}) => ({
    get readOnly() {
        return props.readOnly || false;
    },
    set readOnly(value) {
        setProps({
            readOnly: value
        });
    },
});
export const readOnlyPropsSDKFactory = withValidation(_readOnlyPropsSDKFactory, {
    type: ['object'],
    properties: {
        readOnly: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=readOnlyPropsSDKFactory.js.map