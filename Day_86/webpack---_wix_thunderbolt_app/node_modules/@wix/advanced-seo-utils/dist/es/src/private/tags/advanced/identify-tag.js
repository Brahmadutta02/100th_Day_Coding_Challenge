import {
    GENERAL_IDENTIFIERS
} from '../../types/Identifiers';
import PROPS from '../../types/Props';
import {
    TAG_TYPES
} from '../../types/TagTypes';
export var identifyTag = function(seoTag) {
    var _a;
    var type = seoTag === null || seoTag === void 0 ? void 0 : seoTag.type;
    switch (type) {
        case TAG_TYPES.LINK:
            {
                return GENERAL_IDENTIFIERS.LINK;
            }
        case TAG_TYPES.META:
            {
                if ((_a = seoTag === null || seoTag === void 0 ? void 0 : seoTag.props) === null || _a === void 0 ? void 0 : _a[PROPS.PROPERTY]) {
                    return GENERAL_IDENTIFIERS.OG_TAG;
                }
                return GENERAL_IDENTIFIERS.SATANDARD_META;
            }
        default:
            return GENERAL_IDENTIFIERS.SATANDARD_META;
    }
};