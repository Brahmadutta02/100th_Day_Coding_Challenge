import {
    ERRORS
} from './Errors';
var validValue = {
    isValid: true
};
var getInvalidValue = function(Error, property) {
    return ({
        isValid: false,
        error: new Error(property),
    });
};
export function validateJson(value) {
    try {
        JSON.parse(value);
    } catch (err) {
        return getInvalidValue(ERRORS.INVALID_JSON);
    }
    return validValue;
}
export function validateFullUrl(value) {
    var validFullUrl = /^(?:(?:https?:)?\/\/)+(?:(?:[\u0400-\uA69F\w][\u0400-\uA69F\w-]*)?[\u0400-\uA69F\w]\.)+(?:[\u0400-\uA69Fa-z]+|\d{1,3})(?::[\d]{1,5})?(?:[/?#].*)?\S$/i;
    if (validFullUrl.test(value)) {
        return validValue;
    }
    return getInvalidValue(ERRORS.INVALID_FULL_URL);
}
export function validateAttributeIsInBlacklist(tag) {
    var unauthorizedAttributes = [
        'x-wix-meta-site-id',
        'x-ua-compatible',
        'x-wix-renderer-server',
        'x-wix-application-instance-id',
        'x-wix-published-version',
        'etag',
        'skype_toolbar',
        'fb_admins_meta_tag',
        'fb:admins',
        'viewport',
    ];
    var invalidAttributes = unauthorizedAttributes.filter(function(pattern) {
        return tag.props && tag.props[pattern];
    });
    return invalidAttributes.length ?
        getInvalidValue(ERRORS.TAG_CONTAINS_BLACKLISTED_ATTRIBUTE, invalidAttributes) :
        validValue;
}
export function validateIsInWhiteList(tag) {
    var authorizedTags = ['link', 'meta'];
    var isTagWhiteListed = authorizedTags.some(function(pattern) {
        return tag.type.toLowerCase().indexOf(pattern) !== -1;
    });
    return isTagWhiteListed ?
        validValue :
        getInvalidValue(ERRORS.TAG_TYPE_NOT_ALLOWED);
}
export function validateBrokenTags(value) {
    if (typeof value !== 'string') {
        return validValue;
    }
    var numOpenTags = 0;
    for (var i = 0; i < value.length; i++) {
        var char = value[i];
        if (char === '<') {
            numOpenTags++;
            if (numOpenTags !== 1) {
                return true;
            }
        }
        if (char === '>') {
            numOpenTags -= 1;
            if (numOpenTags !== 0) {
                return true;
            }
        }
    }
    return numOpenTags !== 0 ?
        getInvalidValue(ERRORS.INVALID_TAG_STRUCTURE) :
        validValue;
}
export function validateIsCss(tag) {
    var isCssTag = tag.type === 'link' &&
        tag.props &&
        tag.props.rel &&
        tag.props.rel.toLowerCase().trim() === 'stylesheet';
    return isCssTag ? getInvalidValue(ERRORS.CSS_NOT_ALLOWED) : validValue;
}
export function validateEmptyProps(tag) {
    if (tag.type === 'link' || tag.type === 'meta') {
        if (!tag.props) {
            return getInvalidValue(ERRORS.EMPTY_PROPS);
        }
        return Object.values(tag.props)
            .slice(0, 2)
            .map(function(p) {
                return p.replace(/\s+/g, '');
            })
            .every(function(p) {
                return p.length;
            }) ?
            validValue :
            getInvalidValue(ERRORS.EMPTY_PROPS);
    }
    return validValue;
}