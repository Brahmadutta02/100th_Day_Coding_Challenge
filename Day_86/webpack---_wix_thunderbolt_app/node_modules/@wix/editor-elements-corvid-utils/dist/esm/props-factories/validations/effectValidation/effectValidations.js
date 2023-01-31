import {
    reportWarning
} from '../../../reporters';
import {
    messageTemplates
} from '../../../messages';
import {
    effectInfoLink,
    EFFECTS
} from '../../animations';
import {
    effectsValidationSchema
} from './effectValidationSchema';
import {
    createEffectOptionsValidation
} from './effectOptionsValidation';
const isEmpty = (value) => {
    return Object.keys(value).length === 0;
};
export const createEffectValidation = ({
    compName
}) => {
    return ({
        effectName,
        effectOptions,
        propertyName,
    }) => {
        var _a;
        const validateEffectOption = createEffectOptionsValidation({
            propertyName,
            compName,
        });
        // effectName - undefined, effectOptions - undefined
        if (!effectName && !effectOptions) {
            return false;
        }
        // effectName - undefined, effectOptions - not empty
        if (!effectName && effectOptions && !isEmpty(effectOptions)) {
            reportWarning(messageTemplates.warning_effect_options_not_set({
                propertyName,
                compName,
                infoLink: effectInfoLink(propertyName),
            }));
            return false;
        }
        // deprecated effectName fits propertyName && effecOptions not empty ?
        const PROPERTY = propertyName === 'hide' ? 'HIDE' : 'SHOW';
        const deprecatedValues = (_a = EFFECTS[PROPERTY]) === null || _a === void 0 ? void 0 : _a.deprecatedValues;
        if (effectName &&
            effectOptions &&
            deprecatedValues &&
            deprecatedValues.find((effect) => effect === effectName) &&
            !isEmpty(effectOptions)) {
            reportWarning(messageTemplates.warning_deprecated_effect_with_options({
                compName,
                effectName,
                propertyName,
                infoLink: effectInfoLink(propertyName),
            }));
            return false;
        }
        // deprecated effectName fits
        if (deprecatedValues.find((effect) => effect === effectName)) {
            return true;
        }
        // effectName - isValid?
        if (effectName && !(effectName in effectsValidationSchema)) {
            reportWarning(messageTemplates.warning_invalid_effect_name({
                propertyName,
                compName,
                effectName,
                infoLink: effectInfoLink(propertyName),
            }));
            return false;
        }
        // effectOptions - isValid?
        if (!validateEffectOption(effectName, effectOptions)) {
            return false;
        }
        return true;
    };
};
//# sourceMappingURL=effectValidations.js.map