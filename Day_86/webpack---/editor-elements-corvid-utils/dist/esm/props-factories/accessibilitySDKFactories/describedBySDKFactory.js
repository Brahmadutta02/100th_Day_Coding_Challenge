import {
    withValidation
} from '../..';
import {
    createTextElementValidator
} from './accessibilityUtils/validators';
const describedBySDKFactory = ({
    setProps,
    props,
    create$w
}) => ({
    get describedBy() {
        var _a;
        if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.describedBy)) {
            return undefined;
        }
        const $w = create$w();
        return $w(`#${props.ariaAttributes.describedBy}`);
    },
    set describedBy(selector) {
        if (!selector) {
            setProps({
                ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                    describedBy: undefined
                }),
            });
            return;
        }
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                describedBy: selector.uniqueId
            }),
        });
    },
});
const customRules = {
    describedBy: [createTextElementValidator('describedBy')],
};
export const createDescribedBySDK = withValidation(describedBySDKFactory, {
    type: ['object'],
    properties: {
        describedBy: {
            type: ['object', 'nil'],
        },
    },
}, customRules);
//# sourceMappingURL=describedBySDKFactory.js.map