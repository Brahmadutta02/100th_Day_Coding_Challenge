var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    TAG_TYPES
} from '../../types/TagTypes';
export var removeBlackListedTags = function(tags) {
    if (tags === void 0) {
        tags = [];
    }
    return tags
        .map(function(tag) {
            var modifiedTag = getFilterCallbacks(tag);
            switch (tag.type) {
                case TAG_TYPES.LINK:
                    modifiedTag = getSantitizedLink(tag);
                    break;
                case TAG_TYPES.SCRIPT:
                    modifiedTag = getFilterScript(tag);
                    break;
                case TAG_TYPES.META:
                case TAG_TYPES.TITLE:
                    modifiedTag = tag;
                    break;
                default:
                    modifiedTag = false;
            }
            return modifiedTag;
        })
        .filter(function(tag) {
            return tag;
        });
};

function getFilterScript(tag) {
    if (tag === void 0) {
        tag = {};
    }
    return tag.props && tag.props.type === 'application/ld+json' ? tag : false;
}

function getSantitizedLink(tag) {
    if (tag === void 0) {
        tag = {};
    }
    return cleanedValue(tag.props && tag.props.rel).includes('stylesheet') ?
        __assign(__assign({}, tag), {
            props: __assign(__assign({}, tag.props), {
                rel: ''
            })
        }) : tag;
}

function getFilterCallbacks(tag) {
    if (tag === void 0) {
        tag = {};
    }
    if (typeof tag.props !== 'object') {
        return tag;
    }
    var cleanedProps = {};
    Object.keys(tag.props).forEach(function(prop) {
        if (prop.substring(0, 2) !== 'on') {
            cleanedProps[prop] = tag.props[prop];
        }
    });
    tag.props = cleanedProps;
    return tag;
}

function cleanedValue(val) {
    if (val === void 0) {
        val = '';
    }
    return val.toLowerCase().trim();
}