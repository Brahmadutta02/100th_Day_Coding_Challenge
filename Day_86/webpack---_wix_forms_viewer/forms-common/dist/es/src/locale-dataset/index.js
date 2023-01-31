import {
    countries
} from './resources';
import topology from '../constants/topology';
import {
    GEO_CODE_MAP
} from './country-codes/constants';
export {
    getCountryCodeByGEO,
    COUNTRIES_CODES,
}
from './country-codes';
var COUNTRY_TRANSLATION_PREFIX = 'locale-dataset.countries.';
var localeDataURL = "https://static.parastorage.com/services/locale-dataset-data/".concat(topology.dataset, "/translations");
var LocaleData = /** @class */ (function() {
    function LocaleData(createI18Next) {
        this.translations = createI18Next({
            asyncMessagesLoader: function(locale) {
                return fetch("".concat(localeDataURL, "/messages_").concat(locale, ".json")).then(function(res) {
                    return res.ok && res.json();
                });
            },
        });
    }
    LocaleData.prototype.getAllCountries = function(existingCountries) {
        var _this = this;
        return (existingCountries || countries)
            .reduce(function(acc, value) {
                var label = _this.getCountryByKey(value);
                if (label) {
                    acc.push({
                        value: value,
                        label: label
                    });
                }
                return acc;
            }, [])
            .sort(function(_a, _b) {
                var firstName = _a.label;
                var secondName = _b.label;
                return firstName < secondName ? -1 : firstName > secondName ? 1 : 0;
            });
    };
    LocaleData.prototype.getCountryByKey = function(key) {
        if (GEO_CODE_MAP[key]) {
            return this.translations.t("".concat(COUNTRY_TRANSLATION_PREFIX).concat(key));
        }
    };
    return LocaleData;
}());
export {
    LocaleData
};
//# sourceMappingURL=index.js.map