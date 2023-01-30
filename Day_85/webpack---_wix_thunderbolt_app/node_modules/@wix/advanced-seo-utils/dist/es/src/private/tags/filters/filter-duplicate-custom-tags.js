import {
    GENERAL_IDENTIFIERS
} from '../../types/Identifiers';
import {
    identifyCustomTag
} from '../custom/identify-custom-tag';
import PROPS from '../../types/Props';
export var filterDuplicateCustomTags = function(allTags, currentTags) {
    return allTags.filter(function(tag) {
        if (!tag.custom || !currentTags.length) {
            return true;
        }
        var tagIdentifier = identifyCustomTag(tag);
        if (!tagIdentifier) {
            return false;
        }
        return !currentTags.some(function(currentTag) {
            var currentTagIdentifier = identifyCustomTag(currentTag);
            if (currentTagIdentifier !== tagIdentifier) {
                return false;
            }
            switch (currentTagIdentifier) {
                case GENERAL_IDENTIFIERS.LINK:
                    return isLinkTagEquals(tag, currentTag);
                case GENERAL_IDENTIFIERS.OG_TAG:
                    return isOgTagEquals(tag, currentTag);
                case GENERAL_IDENTIFIERS.SATANDARD_META:
                    return isStandardMetaTagEquals(tag, currentTag);
                default:
                    return false;
            }
        });
    });
};

function isLinkTagEquals(tag, currentTag) {
    if (tag.props[PROPS.HREFLANG] && currentTag.props[PROPS.HREFLANG]) {
        return tag.props[PROPS.HREFLANG] === currentTag.props[PROPS.HREFLANG];
    }
    return tag.props[PROPS.REL] === currentTag.props[PROPS.REL];
}

function isOgTagEquals(tag, currentTag) {
    return tag.props[PROPS.PROPERTY] === currentTag.props[PROPS.PROPERTY];
}

function isStandardMetaTagEquals(tag, currentTag) {
    return tag.props[PROPS.NAME] === currentTag.props[PROPS.NAME];
}