import {
    __awaiter,
    __generator
} from "tslib";
import {
    ProductsApi
} from '../../../../apis/ProductsApi/ProductsApi';
var getProductsApi = function(siteStore, origin) {
    return new ProductsApi({
        siteStore: siteStore,
        origin: origin
    });
};
export var getSlugByProductId = function(productId, _a) {
    var context = _a.context,
        origin = _a.origin;
    return __awaiter(void 0, void 0, void 0, function() {
        var product;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    return [4 /*yield*/ , getProductsApi(context.siteStore, origin).fetchProductSlug(productId)];
                case 1:
                    product = _b.sent();
                    if (!product) {
                        throw Error('Product with provided productId does not exist');
                    }
                    return [2 /*return*/ , product.urlPart];
            }
        });
    });
};
//# sourceMappingURL=getSlugByProductId.js.map