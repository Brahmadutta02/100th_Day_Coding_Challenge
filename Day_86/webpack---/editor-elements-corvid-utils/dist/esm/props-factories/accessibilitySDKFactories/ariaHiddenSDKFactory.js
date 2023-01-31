import {
    assert
} from '../..';
import {
    withValidation
} from '../../validations';
const ariaHiddenSDKFactory = ({
    setProps,
    props
}) => ({
    get hidden() {
        var _a;
        return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.hidden;
    },
    set hidden(value) {
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                hidden: assert.isNil(value) ? undefined : value
            }),
        });
    },
});
export const createAriaHiddenSDK = withValidation(ariaHiddenSDKFactory, {
    type: ['object'],
    properties: {
        hidden: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=ariaHiddenSDKFactory.js.map