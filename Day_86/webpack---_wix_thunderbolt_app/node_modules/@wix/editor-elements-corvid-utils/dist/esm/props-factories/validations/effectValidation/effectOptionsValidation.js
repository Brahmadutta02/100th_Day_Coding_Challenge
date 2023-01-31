import {
    messageTemplates
} from '../../../messages';
import {
    createSchemaValidator,
} from '../../../validations/createSchemaValidator';
import {
    reportWarning
} from '../../../reporters';
import {
    effectInfoLink
} from '../../animations';
import {
    effectsValidationSchema
} from './effectValidationSchema';
const createInvalidOptionsTypeWarningReporter = ({
    effectName,
    propertyName,
    compName,
}) => {
    return (message, messageParams) => {
        reportWarning(messageTemplates.warning_invalid_type_effect_options({
            propertyName,
            compName,
            effectName,
            wrongValue: `${messageParams === null || messageParams === void 0 ? void 0 : messageParams.value}`,
            infoLink: effectInfoLink(propertyName),
        }));
    };
};
const createWrongOptionsWarningReporter = ({
    effectName,
    propertyName,
    compName,
}) => {
    return (message, messageParams) => {
        reportWarning(messageTemplates.warning_invalid_effect_options({
            propertyName,
            compName,
            effectName,
            wrongProperty: 'value',
            wrongValue: `the key "${messageParams === null || messageParams === void 0 ? void 0 : messageParams.propertyName}" cannot be set to the value "${messageParams === null || messageParams === void 0 ? void 0 : messageParams.value}"`,
            infoLink: effectInfoLink(propertyName),
        }));
    };
};
export const createEffectOptionsValidation = ({
    propertyName,
    compName,
}) => {
    return (effectName, effectOptions) => {
        if (!effectName) {
            return false;
        }
        if (effectOptions === undefined) {
            return true;
        }
        /**
         * Here we want to reuse createSchemaValidator, but
         * current implementation of it does not meet our needs.
         * We need:
         * 1. report warning instead of error
         * 2. report custom message instead of built by schema validator
         * Here below we have a hack where we pass warning report on for error reporting.
         */
        const invalidOptionTypeReporter = createInvalidOptionsTypeWarningReporter({
            effectName,
            propertyName,
            compName,
        });
        const isEffectOptionsTypeValid = () => createSchemaValidator({
            reportError: invalidOptionTypeReporter,
            reportWarning: () => ({}),
        }, compName)(effectOptions, {
            type: ['object']
        }, propertyName);
        if (!isEffectOptionsTypeValid()) {
            return false;
        }
        /**
         * Here we want to reuse createSchemaValidator, but
         * current implementation of it does not meet our needs.
         * We need:
         * 1. report warning instead of error
         * 2. report custom message instead of built by schema validator
         * Here below we have a hack where we pass warning report on for error reporting.
         */
        const invalidEffectOptionsReporter = createWrongOptionsWarningReporter({
            effectName,
            propertyName,
            compName,
        });
        const isEffectOptionsValid = () => createSchemaValidator({
            reportError: invalidEffectOptionsReporter,
            reportWarning: () => ({}),
        }, compName)(effectOptions, effectsValidationSchema[effectName], propertyName);
        if (!isEffectOptionsValid()) {
            return false;
        }
        return true;
    };
};
//# sourceMappingURL=effectOptionsValidation.js.map