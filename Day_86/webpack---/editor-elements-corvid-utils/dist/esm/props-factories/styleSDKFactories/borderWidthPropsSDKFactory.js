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
export const createBorderWidthPropsSDKFactory = (options = {}) => {
    const {
        prefix,
        withoutDefaultValue
    } = options;
    const cssRule = getScopedVar({
        name: cssVars.borderWidth,
        prefix,
    });
    const validatePixel = createPixelValidator({
        propertyName: 'borderWidth',
        cssProperty: 'width',
    });
    const _borderWidthPropsSDKFactory = ({
        setStyles,
        sdkData,
        createSdkState
    }) => {
        var _a;
        const editorInitialWidth = (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.borderWidth;
        const [state, setState] = createSdkState({
            borderWidth: withoutDefaultValue ? undefined : editorInitialWidth,
        }, 'borderWidth');
        return {
            set borderWidth(borderWidth) {
                setState({
                    borderWidth
                });
                setStyles({
                    [cssRule]: borderWidth
                });
            },
            get borderWidth() {
                return state.borderWidth;
            },
            reset() {
                setState({
                    borderWidth: editorInitialWidth
                });
                setStyles({
                    [cssRule]: undefined
                });
            },
        };
    };
    return withValidation(_borderWidthPropsSDKFactory, {
        type: ['object'],
        properties: {
            borderWidth: {
                type: ['string', 'nil'],
            },
        },
    }, {
        borderWidth: [validatePixel],
    });
};
//# sourceMappingURL=borderWidthPropsSDKFactory.js.map