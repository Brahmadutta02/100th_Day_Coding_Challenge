var _a;
import {
    GENERAL_IDENTIFIERS
} from './Identifiers';
import PROPS from './Props';
import {
    validateFullUrl
} from './Validators';
export var setters = (_a = {},
    _a[GENERAL_IDENTIFIERS.LINK] = function(tag, value, enableValidation) {
        var validator = {
            isValid: true
        };
        if (enableValidation) {
            validator = validateFullUrl(value);
        }
        if (validator.isValid) {
            tag.props[PROPS.HREF] = value;
        }
        return validator;
    },
    _a[GENERAL_IDENTIFIERS.OG_TAG] = function(tag, value) {
        tag.props[PROPS.CONTENT] = value || '';
        return {
            isValid: true
        };
    },
    _a[GENERAL_IDENTIFIERS.STANDARD_META] = function(tag, value) {
        tag.props[PROPS.CONTENT] = value || '';
        return {
            isValid: true
        };
    },
    _a);