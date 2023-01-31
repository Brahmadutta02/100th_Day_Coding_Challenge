import {
    assert
} from '../..';
import {
    withValidation
} from '../../validations';
const ariaPressedSDKFactory = ({
    setProps,
    props
}) => ({
    get pressed() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.pressed;
    },
    set pressed(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                pressed: assert.isNil(value) ? undefined : value
            }),
        });
    },
});
export const createAriaPressedSDK = withValidation(ariaPressedSDKFactory, {
    type: ['object'],
    properties: {
        pressed: {
            type: ['string'],
            enum: ['false', 'true', 'mixed'],
        },
    },
});
//# sourceMappingURL=ariaPressedSDKFactory.js.map