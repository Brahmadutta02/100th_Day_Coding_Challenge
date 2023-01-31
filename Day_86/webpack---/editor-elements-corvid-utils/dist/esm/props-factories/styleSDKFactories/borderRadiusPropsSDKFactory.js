import {
    withValidation
} from '../../validations';
import {
    createPixelValidator
} from './validation';
import {
    getScopedVar
} from './styleUtils';
import {
    cssVars
} from './constants';
export const createBorderRadiusPropsSDKFactory = (options = {}) => {
    const {
        prefix,
        withoutDefaultValue
    } = options;
    const cssRule = getScopedVar({
        name: cssVars.borderRadius,
        prefix,
    });
    const validatePixel = createPixelValidator({
        propertyName: 'borderRadius',
        cssProperty: 'radius',
    });
    const _borderRadiusPropsSDKFactory = ({
        setStyles,
        sdkData,
        createSdkState
    }) => {
        var _a;
        const editorInitialRadius = (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.borderRadius;
        const [state, setState] = createSdkState({
            borderRadius: withoutDefaultValue ? undefined : editorInitialRadius,
        }, 'borderRadius');
        return {
            set borderRadius(borderRadius) {
                setState({
                    borderRadius
                });
                setStyles({
                    [cssRule]: borderRadius
                });
            },
            get borderRadius() {
                return state.borderRadius;
            },
            reset() {
                setState({
                    borderRadius: editorInitialRadius
                });
                setStyles({
                    [cssRule]: undefined
                });
            },
        };
    };
    return withValidation(_borderRadiusPropsSDKFactory, {
        type: ['object'],
        properties: {
            borderRadius: {
                type: ['string', 'nil'],
            },
        },
    }, {
        borderRadius: [validatePixel],
    });
};
//# sourceMappingURL=borderRadiusPropsSDKFactory.js.map