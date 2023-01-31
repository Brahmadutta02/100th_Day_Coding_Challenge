import {
    assert
} from '../..';
import {
    withValidation
} from '../../validations';
const ariaHaspopupSDKFactory = ({
    setProps,
    props
}) => ({
    get haspopup() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.haspopup;
    },
    set haspopup(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                haspopup: assert.isNil(value) ? undefined : value
            }),
        });
    },
});
export const createAriaHaspopupSDK = withValidation(ariaHaspopupSDKFactory, {
    type: ['object'],
    properties: {
        haspopup: {
            type: ['string'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=ariaHaspopupSDKFactory.js.map