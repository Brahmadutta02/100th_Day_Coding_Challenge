import {
    reportError
} from '../reporters';
import {
    messageTemplates
} from '../messages';
const validateEffects = (possibleEffects, effects, functionName) => {
    const invalidEffects = effects.filter(name => !possibleEffects.includes(name));
    if (invalidEffects.length) {
        reportError(messageTemplates.error_effects_input({
            functionName,
            wrongEffects: invalidEffects,
            allowedEffects: possibleEffects,
        }));
    }
};
export const effectsTriggersSDKFactory = api => {
    const getEffects = () => {
        var _a;
        return ((_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.getEffects()) || [];
    };
    return {
        effects: {
            get effects() {
                return getEffects();
            },
            get activeEffects() {
                var _a;
                return ((_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.getActiveEffects()) || [];
            },
            applyEffects: effects => {
                var _a;
                validateEffects(getEffects(), effects, 'applyEffects');
                (_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.applyEffects(...effects);
            },
            removeEffects: effects => {
                var _a;
                validateEffects(getEffects(), effects, 'removeEffects');
                (_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.removeEffects(...effects);
            },
            toggleEffects: effects => {
                var _a;
                validateEffects(getEffects(), effects, 'toggleEffects');
                (_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.toggleEffects(...effects);
            },
            removeAllEffects: () => {
                var _a;
                return (_a = api.effectsTriggersApi) === null || _a === void 0 ? void 0 : _a.removeAllEffects();
            },
        },
    };
};
//# sourceMappingURL=effectsTriggersSDKFactory.js.map