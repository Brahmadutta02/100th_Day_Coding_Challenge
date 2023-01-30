import base64 from 'base-64';
var LINGUIST_HEADER_KEY = 'x-wix-linguist';
export function linguistHeader(_a) {
    var _b;
    var lang = _a.lang,
        locale = _a.locale,
        isPrimaryLanguage = _a.isPrimaryLanguage,
        signedInstance = _a.signedInstance;
    // Validate all parameters exists in order to create the linguist header.
    if (isMultilingualOptionsAreValid({
            lang: lang,
            locale: locale,
            isPrimaryLanguage: isPrimaryLanguage
        })) {
        var instanceId = getInstanceIdFromSignedInstance(signedInstance);
        if (instanceId !== undefined) {
            return _b = {},
                _b[LINGUIST_HEADER_KEY] = [
                    lang,
                    locale,
                    isPrimaryLanguage === null || isPrimaryLanguage === void 0 ? void 0 : isPrimaryLanguage.toString(),
                    instanceId,
                ].join('|'),
                _b;
        }
    }
    return {};
}

function isMultilingualOptionsAreValid(_a) {
    var lang = _a.lang,
        locale = _a.locale,
        isPrimaryLanguage = _a.isPrimaryLanguage;
    return (lang && locale && /^(true|false)$/.test((isPrimaryLanguage === null || isPrimaryLanguage === void 0 ? void 0 : isPrimaryLanguage.toString()) || ''));
}

function getInstanceIdFromSignedInstance(signedInstance) {
    try {
        var encodedInstance = signedInstance === null || signedInstance === void 0 ? void 0 : signedInstance.split('.')[1];
        if (encodedInstance) {
            return JSON.parse(base64.decode(encodedInstance)).instanceId;
        }
    } catch (e) {}
}
//# sourceMappingURL=linguist.js.map