import {
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    ProductsApi
} from '../../apis/ProductsApi/ProductsApi';
import {
    BaseActions
} from '../BaseActions';
import {
    PageMap
} from '@wix/wixstores-client-core';
var ProductActions = /** @class */ (function(_super) {
    __extends(ProductActions, _super);

    function ProductActions(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin;
        var _this = _super.call(this, {
            siteStore: siteStore,
            origin: origin
        }) || this;
        _this.productsApi = new ProductsApi({
            siteStore: siteStore,
            origin: origin
        });
        return _this;
    }
    ProductActions.prototype.fetchExtendedProductBySlug = function(slug) {
        // todo fed ops
        // todo bi
        return this.productsApi.fetchExtendedProductBySlug(slug);
    };
    ProductActions.prototype.fetchExtendedProductById = function(id) {
        // todo fed ops
        // todo bi
        return this.productsApi.fetchExtendedProductById(id);
    };
    ProductActions.prototype.fetchDefaultProduct = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.productsApi.fetchDefaultProduct()];
            });
        });
    };
    ProductActions.prototype.navigateToProductPage = function(_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function() {
            var nextProduct;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetchExtendedProductById(id)];
                    case 1:
                        nextProduct = _b.sent();
                        return [2 /*return*/ , this.siteStore.navigate({
                            sectionId: PageMap.PRODUCT,
                            queryParams: undefined,
                            state: nextProduct.urlPart,
                        })];
                }
            });
        });
    };
    return ProductActions;
}(BaseActions));
export {
    ProductActions
};
//# sourceMappingURL=ProductActions.js.map