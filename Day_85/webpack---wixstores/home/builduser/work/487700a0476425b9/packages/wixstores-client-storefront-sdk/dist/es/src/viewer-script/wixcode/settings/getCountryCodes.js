import {
    LocaleApi
} from '../../../apis/LocaleApi/LocaleApi';
export var getCountryCodes = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function() {
        return new LocaleApi({
            siteStore: context.siteStore,
            origin: origin
        }).getCountryCodes();
    };
};
//# sourceMappingURL=getCountryCodes.js.map