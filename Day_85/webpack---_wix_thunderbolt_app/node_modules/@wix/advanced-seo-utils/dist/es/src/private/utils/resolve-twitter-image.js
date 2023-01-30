import {
    getValueByIdentifier
} from '../tags/values/get-by-identifier';
import {
    updateValueByIdentifier
} from '../tags/values/update-by-identifier';
import {
    IDENTIFIERS
} from '../types/Identifiers';
import {
    buildOgImageFullUrl
} from './build-og-image';
var TWITTER_IMAGE = IDENTIFIERS.TWITTER_IMAGE,
    OG_IMAGE = IDENTIFIERS.OG_IMAGE;
export function resolveTwitterImage(tags) {
    var urlOrName = getValueByIdentifier(tags, TWITTER_IMAGE);
    if (!urlOrName) {
        return tags;
    }
    var ogImage = getValueByIdentifier(tags, OG_IMAGE);
    if (ogImage === null || ogImage === void 0 ? void 0 : ogImage.includes(urlOrName)) {
        return updateValueByIdentifier(tags, TWITTER_IMAGE, ogImage);
    }
    var src = buildOgImageFullUrl(urlOrName) || urlOrName;
    return updateValueByIdentifier(tags, TWITTER_IMAGE, src);
}