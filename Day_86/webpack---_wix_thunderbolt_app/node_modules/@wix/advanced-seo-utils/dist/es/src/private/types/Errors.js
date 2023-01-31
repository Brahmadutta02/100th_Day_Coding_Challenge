var ERRORS = {
    INVALID_TAG_STRUCTURE: createError('INVALID_TAG_STRUCTURE'),
    INVALID_JSON: createError('INVALID_JSON'),
    TAG_ALREADY_EXISTS: createError('TAG_ALREADY_EXISTS', 'duplicates'),
    TAG_CONTAINS_BLACKLISTED_ATTRIBUTE: createError('TAG_CONTAINS_BLACKLISTED_ATTRIBUTE', 'duplicates'),
    TAG_TYPE_NOT_ALLOWED: createError('TAG_TYPE_NOT_ALLOWED'),
    EMPTY_STRING: createError('EMPTY_STRING'),
    INVALID_STRING_LENGTH: createError('INVALID_STRING_LENGTH'),
    INVALID_URL_CHARACTERS: createError('INVALID_URL_CHARACTERS'),
    INVALID_FULL_URL: createError('INVALID_FULL_URL'),
    CUSTOM_VALIDATOR: createError('CUSTOM_VALIDATOR', 'validatorIndex'),
    INVALID_TAGS_LENGTH: createError('INVALID_TAGS_LENGTH'),
    MAX_LENGTH_EXCEEDED: createError('MAX_LENGTH_EXCEEDED', 'maxLength'),
    CSS_NOT_ALLOWED: createError('CSS_NOT_ALLOWED'),
    EMPTY_PROPS: createError('EMPTY_PROPS'),
    NAME_OR_PROPERTY_ATTRIBUTE_REQUIRED: createError('NAME_OR_PROPERTY_ATTRIBUTE_REQUIRED'),
    REL_ATTRIBUTE_REQUIRED: createError('REL_ATTRIBUTE_REQUIRED'),
    HREF_ATTRIBUTE_REQUIRED: createError('HREF_ATTRIBUTE_REQUIRED'),
    CONTENT_ATTRIBUTE_REQUIRED: createError('CONTENT_ATTRIBUTE_REQUIRED'),
    VARIABLE_NOT_ALLOWED_IN_KEY: createError('VARIABLE_NOT_ALLOWED_IN_KEY'),
    INVALID_SD_NAME: createError('INVALID_SD_NAME'),
    SD_NAME_NOT_DISTINCT: createError('SD_NAME_NOT_DISTINCT'),
    SD_TYPE_NOT_DISTINCT_WARNING: createError('SD_TYPE_NOT_DISTINCT_WARNING'),
};
var ERROR_NAMES = Object.keys(ERRORS).reduce(function(acc, curr) {
    acc[curr] = curr;
    return acc;
}, {});
export {
    ERROR_NAMES,
    ERRORS
};

function createError(name, parameterName) {
    return function SeoError(parameter) {
        var error = new Error(name);
        error.name = name;
        if (parameterName && typeof parameter !== 'undefined') {
            error[parameterName] = parameter;
        }
        return error;
    };
}