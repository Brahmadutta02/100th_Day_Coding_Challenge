import {
    withValidation
} from '../../validations';
import {
    getScopedVar
} from './styleUtils';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
export const createForegroundColorPropsSDKFactory = (options = {}) => {
    const {
        prefix,
        withoutDefaultValue
    } = options;
    const cssRule = getScopedVar({
        name: cssVars.foregroundColor,
        prefix,
    });
    const validateColor = createColorValidator({
        propertyName: 'foregroundColor',
        cssProperty: 'rgbaColor',
        supportAlpha: true,
    });
    const _foregroundColorPropsSDKFactory = ({
        setStyles,
        sdkData,
        createSdkState
    }) => {
        var _a;
        const [state, setState] = createSdkState({
            foregroundColor: withoutDefaultValue ?
                undefined :
                (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.foregroundColor,
        }, 'foregroundColor');
        return {
            set foregroundColor(foregroundColor) {
                setState({
                    foregroundColor
                });
                setStyles({
                    [cssRule]: foregroundColor
                });
            },
            get foregroundColor() {
                return state.foregroundColor;
            },
            reset() {
                var _a;
                setState({
                    foregroundColor: withoutDefaultValue ?
                        undefined :
                        (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.foregroundColor,
                });
                setStyles({
                    [cssRule]: undefined
                });
            },
        };
    };
    return withValidation(_foregroundColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            foregroundColor: {
                type: ['string', 'nil'],
            },
        },
    }, {
        foregroundColor: [validateColor],
    });
};
//# sourceMappingURL=foregroundcolorPropsSDKFactory.js.map