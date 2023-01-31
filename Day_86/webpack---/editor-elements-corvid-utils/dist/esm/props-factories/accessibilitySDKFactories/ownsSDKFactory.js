import {
    withValidation
} from '../../validations';
import {
    createElementValidator
} from './accessibilityUtils/validators';
const ownsSDKFactory = ({
    setProps,
    props,
    create$w
}) => ({
    get owns() {
        var _a;
        if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.owns)) {
            return undefined;
        }
        const $w = create$w();
        return $w(`#${props.ariaAttributes.owns}`);
    },
    set owns(selector) {
        if (!selector) {
            setProps({
                ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                    owns: undefined
                }),
            });
            return;
        }
        setProps({
            ariaAttributes: Object.assign(Object.assign({}, props.ariaAttributes), {
                owns: selector.uniqueId
            }),
        });
    },
});
const customRules = {
    owns: [createElementValidator('owns')],
};
export const createOwnsSDK = withValidation(ownsSDKFactory, {
    type: ['object'],
    properties: {
        owns: {
            type: ['object', 'nil'],
        },
    },
}, customRules);
//# sourceMappingURL=ownsSDKFactory.js.map