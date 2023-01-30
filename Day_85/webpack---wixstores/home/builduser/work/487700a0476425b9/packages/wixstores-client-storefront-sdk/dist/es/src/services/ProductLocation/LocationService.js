import {
    __awaiter,
    __generator
} from "tslib";
import {
    queryToString
} from '../utils';
import {
    CustomUrlApi
} from '../../utils/CustomUrl/CustomUrlApi';
import {
    PageMap
} from '@wix/wixstores-client-core';
import {
    parseUrl
} from '@wix/native-components-infra';
var LocationService = /** @class */ (function() {
    function LocationService(_a) {
        var siteStore = _a.siteStore;
        this.sectionPage = PageMap.PRODUCT;
        this.beenInit = false;
        this.siteStore = siteStore;
        this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);
    }
    LocationService.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a, _b, _c;
            return __generator(this, function(_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/ , this.siteStore.getSectionUrl(this.sectionPage)];
                    case 1:
                        _a._sectionUrl = _d.sent();
                        _b = this;
                        return [4 /*yield*/ , this.customUrlApi.init()];
                    case 2:
                        _b._isUrlWithOverrides = _d.sent();
                        if (!this._isUrlWithOverrides) return [3 /*break*/ , 4];
                        _c = this;
                        return [4 /*yield*/ , this.getCustomizedUrlSegments()];
                    case 3:
                        _c._urlOverrideSegments = _d.sent();
                        _d.label = 4;
                    case 4:
                        this.beenInit = true;
                        return [2 /*return*/ , this];
                }
            });
        });
    };
    Object.defineProperty(LocationService.prototype, "sectionUrl", {
        get: function() {
            this.validateInit();
            return this._sectionUrl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocationService.prototype, "urlOverrideSegments", {
        get: function() {
            this.validateInit();
            return this._urlOverrideSegments;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocationService.prototype, "isUrlWithOverrides", {
        get: function() {
            this.validateInit();
            return this._isUrlWithOverrides;
        },
        enumerable: false,
        configurable: true
    });
    LocationService.prototype.validateInit = function() {
        if (!this.beenInit) {
            throw new Error("init LocationService wasn't called");
        }
    };
    LocationService.prototype.shouldAppendQueryString = function(includeQueryParams) {
        return includeQueryParams && Object.keys(this.siteStore.location.query).length > 0;
    };
    LocationService.prototype.shouldUseCustomUrl = function() {
        return !!(this.isUrlWithOverrides && this.customUrlApi);
    };
    LocationService.prototype.buildUrlUsingSection = function(prefix, includeQueryParams) {
        return !this.shouldAppendQueryString(includeQueryParams) ?
            prefix :
            prefix + "?" + queryToString(this.siteStore.location.query);
    };
    LocationService.prototype.getAbsoluteProductUrl = function(productUrlPart, includeQueryParams) {
        if (includeQueryParams === void 0) {
            includeQueryParams = false;
        }
        if (this.shouldUseCustomUrl()) {
            return this.customUrlApi.buildProductPageUrl({
                slug: productUrlPart
            });
        } else {
            var prefix = this.sectionUrl.url + "/" + productUrlPart;
            return this.buildUrlUsingSection(prefix, includeQueryParams);
        }
    };
    LocationService.prototype.getRelativeProductUrl = function(productUrlPart, includeQueryParams) {
        if (includeQueryParams === void 0) {
            includeQueryParams = false;
        }
        if (this.shouldUseCustomUrl()) {
            return this.customUrlApi.buildProductPageRelativeUrl({
                slug: productUrlPart
            });
        } else {
            var prefix = this.sectionUrl.relativeUrl + "/" + productUrlPart;
            return this.buildUrlUsingSection(prefix, includeQueryParams);
        }
    };
    LocationService.prototype.getCurrentUrl = function() {
        return this.getUrlWithoutParams(this.siteStore.location.url);
    };
    LocationService.prototype.getCustomizedUrlSegments = function() {
        return __awaiter(this, void 0, void 0, function() {
            var currentUrl;
            return __generator(this, function(_a) {
                currentUrl = this.getCurrentUrl();
                return [2 /*return*/ , this.siteStore.siteApis.getCustomizedUrlSegments(currentUrl)];
            });
        });
    };
    LocationService.prototype.getUrlWithoutParams = function(url) {
        var parsedUrl = parseUrl(url);
        return parsedUrl.protocol + "://" + parsedUrl.host + parsedUrl.path;
    };
    return LocationService;
}());
export {
    LocationService
};
//# sourceMappingURL=LocationService.js.map