export const REMOVABLE_ATTRIBUTES = ['ariaLabel'];
export var ErrorMessages;
(function(ErrorMessages) {
    ErrorMessages["ARIA_LABEL_NOT_STRING"] = "aria-label must be string";
    ErrorMessages["ARIA_LABEL_EMPTY_STRING"] = "aria-label can't be an empty string";
    ErrorMessages["REMOVING_MISSING_ATTRIBUTE"] = "Cannot remove a non existing attribute";
})(ErrorMessages || (ErrorMessages = {}));
export const getNotTextSelectorError = (property) => `The parameter that is passed to the ‘${property}’ property must be a selector function of a text element.`;
export const getNotSelectorError = (property) => `The parameter that is passed to the ‘${property}’ property must be a selector function of an element.`;
export const getInvalidScreenReaderValueError = (property) => `The parameter that is passed to the ‘${property}’ property must be a string or ‘null’.`;
//# sourceMappingURL=constants.js.map