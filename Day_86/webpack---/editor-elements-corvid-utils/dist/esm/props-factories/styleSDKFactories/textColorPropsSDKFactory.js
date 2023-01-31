import {
    withValidation
} from '../../validations';
import {
    getScopedVar,
    isHexaColor,
    isRGBAColor,
    convertColorToRGBAUnits,
} from './styleUtils';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
export const createTextColorPropsSDKFactory = (options = {}) => {
    const {
        prefix,
        withoutDefaultValue
    } = options;
    const cssRule = getScopedVar({
        name: cssVars.textColor,
        prefix,
    });
    const validateColor = createColorValidator({
        propertyName: 'color',
        cssProperty: 'rgbColor',
        supportAlpha: false,
    });
    const _textColorPropsSDKFactory = ({
        setStyles,
        sdkData,
        createSdkState
    }) => {
        var _a;
        const editorInitialColor = (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.color;
        const [state, setState] = createSdkState({
            textColor: withoutDefaultValue ? undefined : editorInitialColor,
        }, 'textColor');
        return {
            set color(value) {
                let textColor = value;
                // RGBA values are casted to RGB by default
                if (isHexaColor(value) || isRGBAColor(value)) {
                    const [r, g, b] = convertColorToRGBAUnits(value);
                    textColor = `rgb(${r}, ${g}, ${b})`;
                }
                setState({
                    textColor
                });
                setStyles({
                    [cssRule]: textColor
                });
            },
            get color() {
                return state.textColor;
            },
            reset() {
                setState({
                    textColor: withoutDefaultValue ? undefined : editorInitialColor,
                });
                setStyles({
                    [cssRule]: undefined
                });
            },
        };
    };
    return withValidation(_textColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            color: {
                type: ['string', 'nil'],
            },
        },
    }, {
        color: [validateColor],
    });
};
//# sourceMappingURL=textColorPropsSDKFactory.js.map