import {
    getLocaleNamespace
} from '@wix/wixstores-client-core';
import {
    compact
} from '../../lib/compact';
import * as _ from 'lodash';
var MultilingualService = /** @class */ (function() {
    function MultilingualService(siteStore, publicData, widgetSettings) {
        if (publicData === void 0) {
            publicData = {};
        }
        if (widgetSettings === void 0) {
            widgetSettings = {};
        }
        var _a;
        this.siteStore = siteStore;
        this.publicData = publicData;
        this.widgetSettings = widgetSettings;
        var multiLangFields = (_a = this.siteStore.getMultiLangFields()) !== null && _a !== void 0 ? _a : this.defaultMultiLangFields;
        this.isPrimaryLanguage = multiLangFields.isPrimaryLanguage;
        this.lang = multiLangFields.lang;
        this.locale = multiLangFields.locale;
    }
    Object.defineProperty(MultilingualService.prototype, "defaultMultiLangFields", {
        get: function() {
            return {
                isPrimaryLanguage: true,
                lang: this.siteStore.locale,
                locale: this.siteStore.locale,
            };
        },
        enumerable: false,
        configurable: true
    });
    MultilingualService.prototype.get = function(key) {
        if (this.isPrimaryLanguage) {
            return this.publicData[key];
        } else {
            var widgetSettingsTextsMap = this.widgetSettings[getLocaleNamespace(this.lang)];
            return widgetSettingsTextsMap === null || widgetSettingsTextsMap === void 0 ? void 0 : widgetSettingsTextsMap[key];
        }
    };
    MultilingualService.prototype.getAll = function() {
        return this.isPrimaryLanguage ? this.publicData : this.widgetSettings[getLocaleNamespace(this.lang)];
    };
    MultilingualService.prototype.setWidgetSettings = function(data) {
        this.widgetSettings = data;
    };
    MultilingualService.prototype.setPublicData = function(data) {
        this.publicData = data;
    };
    MultilingualService.prototype.getMergedTranslationsAsPublicData = function(freeTextFields) {
        var purgedPublicData = _.omit(this.publicData, freeTextFields);
        return compact(_.merge({}, purgedPublicData, this.getAll()));
    };
    return MultilingualService;
}());
export {
    MultilingualService
};
//# sourceMappingURL=MultilingualService.js.map