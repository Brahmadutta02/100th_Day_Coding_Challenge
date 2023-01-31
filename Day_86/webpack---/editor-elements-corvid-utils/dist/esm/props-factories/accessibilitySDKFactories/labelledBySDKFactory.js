import {
    withValidation
} from '../..';
import {
    createTextElementValidator
} from './accessibilityUtils/validators';
const labelledBySDKFactory = ({
    setProps,
    props,
    create$w
}) => ({
    get labelledBy() {
        var _a;
        if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.labelledBy)) {
            return undefined;
        }
        const $w = create$w();
        return $w(`#${props.ariaAttributes.labelledBy}`);
    },
    set labelledBy(selector) {
        if (!selector) {
            setProps({
                ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                    labelledBy: undefined
                }),
            });
            return;
        }
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                labelledBy: selector.uniqueId
            }),
        });
    },
});
const customRules = {
    labelledBy: [createTextElementValidator('labelledBy')],
};
export const createLabelledBySDK = withValidation(labelledBySDKFactory, {
    type: ['object'],
    properties: {
        labelledBy: {
            type: ['object', 'nil'],
        },
    },
}, customRules);
//# sourceMappingURL=labelledBySDKFactory.js.map