import {
    __awaiter,
    __generator
} from "tslib";
import {
    WishlistActions
} from '../../../actions/WishlistActions/WishlistActions';
export function createWishlistExports(_a) {
    var _this = this;
    var context = _a.context;
    return {
        addProducts: function(productIds) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , new WishlistActions({
                        Authorization: context.siteStore.httpClient.getBaseHeaders().Authorization,
                    }).addProducts(productIds)];
                });
            });
        },
        removeProducts: function(productIds) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , new WishlistActions({
                        Authorization: context.siteStore.httpClient.getBaseHeaders().Authorization,
                    }).removeProducts(productIds)];
                });
            });
        },
        getWishlist: function() {
            return __awaiter(_this, void 0, void 0, function() {
                var wishlistResponse;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/ , new WishlistActions({
                                Authorization: context.siteStore.httpClient.getBaseHeaders().Authorization,
                            }).getWishlist()];
                        case 1:
                            wishlistResponse = _a.sent();
                            return [2 /*return*/ , wishlistResponse === null || wishlistResponse === void 0 ? void 0 : wishlistResponse.wishlist];
                    }
                });
            });
        },
    };
}
//# sourceMappingURL=wixcode.wishlist.js.map