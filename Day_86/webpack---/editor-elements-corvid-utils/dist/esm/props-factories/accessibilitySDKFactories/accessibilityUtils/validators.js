import {
    getNotSelectorError,
    getNotTextSelectorError
} from '..';
import {
    messages,
    reportError
} from '../../..';
import {
    isElement,
    isTextElement
} from './assertions';
const baseValidator = (propertyName, allowNil, predicate, failedPredicateError, sdkInstance) => {
    if (!sdkInstance) {
        if (allowNil) {
            return true;
        }
        reportError(messages.invalidTypeMessage({
            value: sdkInstance,
            types: ['object'],
            propertyName,
            functionName: `set ${propertyName}`,
            index: undefined,
        }));
        return false;
    }
    if (!predicate(sdkInstance)) {
        reportError(failedPredicateError);
        return false;
    }
    return true;
};
export const createElementValidator = (propertyName, allowNil = true) => (sdkInstance) => baseValidator(propertyName, allowNil, isElement, getNotSelectorError(propertyName), sdkInstance);
export const createTextElementValidator = (propertyName, allowNil = true) => (sdkInstance) => baseValidator(propertyName, allowNil, isTextElement, getNotTextSelectorError(propertyName), sdkInstance);
//# sourceMappingURL=validators.js.map