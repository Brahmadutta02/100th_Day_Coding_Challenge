import {
    __awaiter,
    __generator,
    __read
} from "tslib";
import {
    STORES_FQDN
} from '@wix/wixstores-client-core';
var CustomUrlApi = /** @class */ (function() {
    function CustomUrlApi(buildCustomizedUrl) {
        this.buildCustomizedUrl = buildCustomizedUrl;
        this.beenInit = false;
        //
    }
    CustomUrlApi.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a, absoluteUrl, relativeUrl, error_1;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        this.beenInit = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/ , Promise.all([
                            this.buildProductUrlTemplate(),
                            this.buildProductUrlTemplate('/'),
                        ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), absoluteUrl = _a[0], relativeUrl = _a[1];
                        this.absoluteUrlWithStub = absoluteUrl;
                        this.relativeUrlWithStub = relativeUrl;
                        return [2 /*return*/ , !!this.absoluteUrlWithStub && !!this.relativeUrlWithStub];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/ , false];
                    case 4:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CustomUrlApi.prototype.buildProductPageUrl = function(urlSegments) {
        return this.getProductWithStub(this.absoluteUrlWithStub, urlSegments);
    };
    CustomUrlApi.prototype.buildProductPageRelativeUrl = function(urlSegments) {
        return this.getProductWithStub(this.relativeUrlWithStub, urlSegments);
    };
    CustomUrlApi.prototype.buildProductUrlTemplate = function(baseUrl) {
        var pathPrefix = 'product-page';
        return this.buildCustomizedUrl(STORES_FQDN.PRODUCT_PAGE, {
            slug: 'abc'
        }, baseUrl ? {
            pathPrefix: pathPrefix,
            baseUrl: baseUrl
        } : {
            pathPrefix: pathPrefix
        }).then(function(url) {
            return url === null || url === void 0 ? void 0 : url.replace(/abc/g, '{stub}');
        });
    };
    CustomUrlApi.prototype.getProductWithStub = function(urlWithStub, urlSegments) {
        if (!this.beenInit) {
            throw new Error('init CustomUrlApi wasn`t called');
        }
        return urlWithStub.replace(/{stub}/g, urlSegments.slug);
    };
    return CustomUrlApi;
}());
export {
    CustomUrlApi
};
//# sourceMappingURL=CustomUrlApi.js.map