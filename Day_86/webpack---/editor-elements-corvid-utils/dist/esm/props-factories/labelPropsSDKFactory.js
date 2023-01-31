import {
    withValidation
} from '../validations';
const _labelPropsSDKFactory = ({
    setProps,
    props
}) => ({
    get label() {
        return props.label || '';
    },
    set label(value) {
        const label = value || '';
        setProps({
            label
        });
    },
});
export const labelPropsSDKFactory = withValidation(_labelPropsSDKFactory, {
    type: ['object'],
    properties: {
        label: {
            type: ['string', 'nil'],
            warnIfNil: true,
        },
    },
});
//# sourceMappingURL=labelPropsSDKFactory.js.map