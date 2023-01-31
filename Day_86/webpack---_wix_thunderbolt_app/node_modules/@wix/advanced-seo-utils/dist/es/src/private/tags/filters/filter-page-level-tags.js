import {
    identify
} from '../../renderer/utils/identify';
import {
    IDENTIFIERS
} from '../../types/Identifiers';
import {
    safelyParseJsonData
} from '../../renderer/utils/safely-parse-json-data';
var BLACK_LIST = [IDENTIFIERS.DESCRIPTION];
export function filterPageLevelTags(advancedSeoData) {
    var filteredTags;
    if (typeof advancedSeoData === 'string') {
        filteredTags = safelyParseJsonData(advancedSeoData);
    }
    filteredTags = ((filteredTags || advancedSeoData).tags || []).filter(function(tag) {
        var identifier = identify(tag);
        return !BLACK_LIST.some(function(i) {
            return identifier === i;
        });
    });
    return {
        tags: filteredTags
    };
}