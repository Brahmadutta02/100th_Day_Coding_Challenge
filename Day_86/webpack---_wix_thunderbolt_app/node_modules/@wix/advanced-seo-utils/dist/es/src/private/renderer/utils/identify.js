import {
    IDENTIFIERS
} from '../../types/Identifiers';
import {
    TAG_SCHEMAS
} from '../../types/TagSchemas';
import {
    validateTagStructure
} from '../../tags/utils/validate-tag-structure';
import {
    filterIdentifierKeys
} from '../../tags/filters/filter-identifier-keys';
/**
 * Tries to identify a tag and either returns identifier or `undefined`.
 *
 * @param {*} tag to identify.
 */
export function identify(tag, ignoreList) {
    if (ignoreList === void 0) {
        ignoreList = [];
    }
    if (!tag) {
        return undefined;
    }
    return findTagWithIdentifiers(tag, ignoreList);
}
var findTagWithIdentifiers = function(tag, ignoreList) {
    var identifierKeys = filterIdentifierKeys(IDENTIFIERS, ignoreList);
    return identifierKeys.find(function(identifier) {
        var schema = TAG_SCHEMAS[identifier];
        if (!schema) {
            return false;
        }
        return validateTagStructure(tag, schema);
    });
};