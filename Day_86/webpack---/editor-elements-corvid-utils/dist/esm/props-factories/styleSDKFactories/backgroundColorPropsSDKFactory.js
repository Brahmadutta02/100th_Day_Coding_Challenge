import {
    withValidation
} from '../../validations';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
import {
    getScopedVar,
    extractOpacity,
    applyOpacity,
    isHexaColor,
    isRGBAColor,
    convertColorToRGBAUnits,
    roundToTwoDecimals,
} from './styleUtils';
export const createBackgroundColorPropsSDKFactory = (options = {
    supportOpacity: true
}) => {
    const {
        prefix,
        supportOpacity,
        withoutDefaultValue
    } = options;
    const cssRule = getScopedVar({
        name: cssVars.backgroundColor,
        prefix,
    });
    const validateColor = createColorValidator({
        propertyName: 'backgroundColor',
        cssProperty: supportOpacity ? 'rgbaColor' : 'rgbColor',
        supportAlpha: supportOpacity,
    });
    const _backgroundColorPropsSDKFactory = ({
        setStyles,
        sdkData,
        createSdkState
    }) => {
        var _a;
        const editorInitialColor = (_a = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _a === void 0 ? void 0 : _a.backgroundColor;
        const editorOpacity = extractOpacity(editorInitialColor);
        const [state, setState] = createSdkState({
            backgroundColor: withoutDefaultValue ? undefined : editorInitialColor,
        }, 'backgroundColor');
        return {
            set backgroundColor(value) {
                let backgroundColor = value;
                /**
                 * !Alert! This feature is intended.
                 * if mixin does not support opacity - cast it to RGB
                 */
                if (!supportOpacity && (isHexaColor(value) || isRGBAColor(value))) {
                    const [r, g, b] = convertColorToRGBAUnits(value);
                    backgroundColor = `rgb(${r}, ${g}, ${b})`;
                }
                /**
                 * !Alert! This feature is intended.
                 *  Editor color alpha gets modified by the amount of user color alpha
                 */
                if (typeof editorOpacity === 'number' && editorOpacity !== 1) {
                    const userOpacity = extractOpacity(value);
                    const opacity = userOpacity ?
                        roundToTwoDecimals(editorOpacity * userOpacity) :
                        editorOpacity;
                    backgroundColor = applyOpacity(backgroundColor, opacity);
                }
                setState({
                    backgroundColor
                });
                setStyles({
                    [cssRule]: backgroundColor
                });
            },
            get backgroundColor() {
                return state.backgroundColor;
            },
            reset() {
                setState({
                    backgroundColor: withoutDefaultValue ? undefined : editorInitialColor,
                });
                setStyles({
                    [cssRule]: undefined
                });
            },
        };
    };
    return withValidation(_backgroundColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            backgroundColor: {
                type: ['string', 'nil'],
            },
        },
    }, {
        backgroundColor: [validateColor],
    });
};
//# sourceMappingURL=backgroundColorPropsSDKFactory.js.map