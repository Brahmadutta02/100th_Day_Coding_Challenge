import {
    GENERAL_IDENTIFIERS
} from '../../types/Identifiers';
import {
    validateTagStructure
} from '../utils/validate-tag-structure';
import {
    TAG_SCHEMAS
} from '../../types/TagSchemas';
import {
    TAG_TYPES
} from '../../types/TagTypes';
import {
    filterIdentifierKeys
} from '../filters/filter-identifier-keys';
export var identifyCustomTag = function(tag, ignoreList) {
    if (ignoreList === void 0) {
        ignoreList = [];
    }
    var identifierKeys = filterIdentifierKeys(GENERAL_IDENTIFIERS, ignoreList);
    return identifierKeys.find(function(identifier) {
        var _a, _b;
        var schema = TAG_SCHEMAS[identifier];
        if (!schema || !tag.props) {
            return false;
        }
        switch (tag.type) {
            case TAG_TYPES.LINK:
                schema = schema(tag.props.rel);
                break;
            case TAG_TYPES.META:
                schema =
                    identifier === GENERAL_IDENTIFIERS.SATANDARD_META ?
                    schema((_a = tag.props.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) :
                    schema((_b = tag.props.property) === null || _b === void 0 ? void 0 : _b.toLowerCase());
                break;
            default:
                return false;
        }
        return validateTagStructure(tag, schema);
    });
};