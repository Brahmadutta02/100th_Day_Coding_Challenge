import {
    TAG_TYPES
} from '../types/TagTypes';
import PROPS from '../types/Props';
var META = TAG_TYPES.META,
    TITLE = TAG_TYPES.TITLE,
    LINK = TAG_TYPES.LINK,
    SCRIPT = TAG_TYPES.SCRIPT;
var isMeta = ofType(META);
// TODO: Maybe we could optimize this and sort just by meta name/property attribute.
// This would decrease the final bundle size.
var rules = [
    ofType(TITLE),
    and(isMeta, withPropName('description')),
    and(ofType(LINK), withProp(PROPS.REL, 'canonical')),
    and(isMeta, withPropName('robots')),
    and(isMeta, withPropProperty('og:title')),
    and(isMeta, withPropProperty('og:description')),
    and(isMeta, withPropProperty('og:image')),
    and(isMeta, withPropProperty('og:image:width')),
    and(isMeta, withPropProperty('og:image:height')),
    and(isMeta, withPropProperty('og:url')),
    and(isMeta, withPropProperty('og:site_name')),
    and(isMeta, withPropProperty('og:type')),
    and(isMeta, withPropProperty('og:', true)),
    and(ofType(SCRIPT), withProp(PROPS.TYPE, 'application/ld+json')),
    isCustom(),
];
/**
 * Sorts a given tag array according to a well predefined rules.
 *
 * @private should not be exposed outside the library.
 * @param {Array} tags to sort.
 */
export function sort(tags) {
    if (!Array.isArray(tags)) {
        return [];
    }
    return tags.slice().sort(function(a, b) {
        return rank(a) - rank(b);
    });
}

function rank(tag) {
    return (rules.reduce(function(found, rule, index) {
        if (!found && rule(tag)) {
            return index + 1;
        }
        return found;
    }, 0) || rules.length + 1);
}

function and(a, b) {
    return function(tag) {
        return a(tag) && b(tag);
    };
}

function withPropProperty(value, startsWith) {
    return withProp(PROPS.PROPERTY, value, startsWith);
}

function withPropName(value, startsWith) {
    return withProp(PROPS.NAME, value, startsWith);
}

function withProp(name, value, startsWith) {
    return function(tag) {
        var props = (tag || {}).props || {};
        if (startsWith) {
            return (typeof props[name] === 'string' && props[name].indexOf(value) === 0);
        }
        return props[name] === value;
    };
}

function ofType(type) {
    return function(tag) {
        return (tag || {}).type === type;
    };
}

function isCustom() {
    return function(tag) {
        return (tag || {}).custom;
    };
}