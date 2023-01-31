import {
    assert
} from '../assert';
const INVALID_MESSAGES = {
    valueMissing: 'value missing',
    patternMismatch: 'pattern mismatch',
    rangeOverflow: 'range overflow',
    rangeUnderflow: 'range underflow',
    stepMismatch: 'step mismatch',
    typeMismatch: 'type mismatch',
    fileNotUploaded: 'file not uploaded',
    fileTypeNotAllowed: (extension) => `${extension} files are not supported.`,
    fileSizeExceedsLimit: (maxFileSize) => `This file is too big. Select a smaller file (${maxFileSize} max).`,
    tooLong: 'too long',
    tooShort: 'too short',
    exceedsFilesLimit: 'number of files selected exceeds the limit',
    invalidTime: 'invalid time',
    invalidDate: 'invalid date',
};
export const INITIAL_VALIDATION_DATA = {
    type: 'General',
    validity: {
        badInput: false,
        customError: false,
        fileNotUploaded: false,
        fileTypeNotAllowed: false,
        fileSizeExceedsLimit: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing: false,
        exceedsFilesLimit: false,
        valid: true,
        invalidTime: false,
        invalidDate: false,
    },
    validationMessage: '',
    htmlValidationMessageOverride: {
        key: ''
    },
};
export const getValidationMessage = (validityKey, param) => {
    const invalidMessage = INVALID_MESSAGES[validityKey];
    return assert.isString(invalidMessage) ?
        invalidMessage :
        invalidMessage(param);
};
export const getCustomValidityMessage = (validationData) => {
    const hasCustomError = !!validationData.validity.customError;
    return hasCustomError ? validationData.validationMessage : '';
};
export const addErrorToValidationData = (validationData, validityKey, validationMessage) => (Object.assign(Object.assign({}, validationData), {
    validity: Object.assign(Object.assign({}, validationData.validity), {
        [validityKey]: true,
        valid: false
    }),
    validationMessage
}));
export const addCustomValidityToValidationData = (validationData, customValidityMessage) => addErrorToValidationData(validationData, 'customError', customValidityMessage || '');
export const addErrorToValidationDataAndKeepMessage = (validationData, validityKey, validationMessage) => {
    const newValidationMessage = validationData.validationMessage ||
        validationMessage ||
        getValidationMessage(validityKey);
    return addErrorToValidationData(validationData, validityKey, newValidationMessage);
};
export const addErrorToValidationDataAndKeepHtmlMessage = (validationData, validityKey, htmlValidationMessageOverride) => {
    const newHtmlMessage = validationData.htmlValidationMessageOverride.key ?
        validationData.htmlValidationMessageOverride :
        htmlValidationMessageOverride;
    return Object.assign(Object.assign({}, addErrorToValidationDataAndKeepMessage(validationData, validityKey)), {
        htmlValidationMessageOverride: newHtmlMessage
    });
};
export const checkCustomValidity = (customValidator, props, compValueGetter) => {
    let customValidityMessage = '';
    const reject = (message) => {
        customValidityMessage = message;
    };
    const userValue = compValueGetter ? compValueGetter(props) : props.value;
    if (customValidator) {
        customValidator(userValue, reject);
    }
    return customValidityMessage;
};
export const composeValidators = (validators) => (props, api) => {
    return validators.reduce((validationData, validator) => {
        return validator(props, validationData, api);
    }, INITIAL_VALIDATION_DATA);
};
//# sourceMappingURL=validityUtils.js.map