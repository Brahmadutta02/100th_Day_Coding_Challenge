var _a, _b;
import PROPS from './Props';
import {
    TAG_TYPES
} from './TagTypes';
import {
    IDENTIFIERS,
    GENERAL_IDENTIFIERS
} from './Identifiers';
import {
    validateJson
} from './Validators';
import {
    setters
} from './setters';
export var TAG_SCHEMAS = (_a = {},
    _a[IDENTIFIERS.TITLE] = {
        type: TAG_TYPES.TITLE,
        children: true,
        getValue: function(tag) {
            return tag && tag.children;
        },
        setValue: function(tag, value) {
            if (tag && typeof tag === 'object') {
                tag.children = value;
                return {
                    isValid: true
                };
            }
            return {
                isValid: false
            };
        },
    },
    _a[IDENTIFIERS.DESCRIPTION] = buildStandardMeta('description'),
    _a[IDENTIFIERS.OG_TITLE] = buildOgMeta('og:title'),
    _a[IDENTIFIERS.OG_DESCRIPTION] = buildOgMeta('og:description'),
    _a[IDENTIFIERS.OG_IMAGE] = buildOgMeta('og:image'),
    _a[IDENTIFIERS.OG_IMAGE_WIDTH] = buildOgMeta('og:image:width'),
    _a[IDENTIFIERS.OG_IMAGE_HEIGHT] = buildOgMeta('og:image:height'),
    _a[IDENTIFIERS.TWITTER_CARD] = buildTwitterMeta('twitter:card'),
    _a[IDENTIFIERS.TWITTER_TITLE] = buildTwitterMeta('twitter:title'),
    _a[IDENTIFIERS.TWITTER_DESCRIPTION] = buildTwitterMeta('twitter:description'),
    _a[IDENTIFIERS.TWITTER_IMAGE] = buildTwitterMeta('twitter:image'),
    _a[IDENTIFIERS.FB_ADMINS] = buildOgMeta('fb:admins'),
    _a[IDENTIFIERS.ROBOTS] = buildStandardMeta('robots'),
    _a[IDENTIFIERS.STRUCTURED_DATA] = {
        type: TAG_TYPES.SCRIPT,
        props: (_b = {}, _b[PROPS.TYPE] = 'application/ld+json', _b),
        children: true,
        getValue: function(tag) {
            return tag.children;
        },
        setValue: function(tag, value, enableValidation) {
            var validator = {
                isValid: true
            };
            if (enableValidation) {
                validator = validateJson(value);
            }
            if (validator.isValid) {
                tag.children = value;
            }
            return validator;
        },
    },
    _a[IDENTIFIERS.CANONICAL] = buildLink('canonical'),
    _a[GENERAL_IDENTIFIERS.LINK] = function(rel) {
        return buildLink(rel);
    },
    _a[GENERAL_IDENTIFIERS.SATANDARD_META] = function(name) {
        return buildStandardMeta(name);
    },
    _a[GENERAL_IDENTIFIERS.OG_TAG] = function(name) {
        return buildOgMeta(name);
    },
    _a);

function buildOgMeta(name) {
    return buildStandardMeta(name, PROPS.PROPERTY);
}

function buildStandardMeta(name, prop) {
    var _a;
    if (prop === void 0) {
        prop = PROPS.NAME;
    }
    return {
        type: TAG_TYPES.META,
        props: (_a = {}, _a[prop] = name, _a[PROPS.CONTENT] = '', _a),
        getValue: function(tag) {
            return tag.props[PROPS.CONTENT];
        },
        setValue: function(tag, value) {
            return setters[GENERAL_IDENTIFIERS.STANDARD_META](tag, value);
        },
    };
}

function buildTwitterMeta(name, prop) {
    return buildStandardMeta(name, prop);
}

function buildLink(rel) {
    var _a;
    return {
        type: TAG_TYPES.LINK,
        props: (_a = {}, _a[PROPS.REL] = rel, _a[PROPS.HREF] = '', _a),
        getValue: function(tag) {
            return tag.props[PROPS.HREF];
        },
        setValue: function(tag, value, enableValidation) {
            return setters[GENERAL_IDENTIFIERS.LINK](tag, value, enableValidation);
        },
    };
}