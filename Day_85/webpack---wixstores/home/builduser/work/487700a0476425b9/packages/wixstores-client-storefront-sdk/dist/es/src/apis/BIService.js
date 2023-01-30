import {
    __assign
} from "tslib";
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
    SPECS
} from '../constants';
import {
    getCatalogAppIds
} from '../utils/cart/bi.utils';
import {
    graphqlCartToCartSummary
} from './CartApi/graphqlCartToCartSummary';
var BIService = /** @class */ (function() {
    function BIService(_a) {
        var _this = this;
        var siteStore = _a.siteStore,
            origin = _a.origin;
        this.updateBuyerNote = function(cart, hasNote) {
            var biParams = __assign({
                cartId: cart.cartId
            }, _this.baseParams);
            var cartSummary = graphqlCartToCartSummary(cart);
            if (_this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130)) {
                var catalogAppId = getCatalogAppIds(cartSummary);
                var checkoutId = cartSummary.checkoutId;
                hasNote
                    ?
                    _this.siteStore.platformBiLogger.saveNoteToSellerSf(__assign(__assign({}, biParams), {
                        is_empty: false,
                        catalogAppId: catalogAppId,
                        checkoutId: checkoutId
                    })) :
                    _this.siteStore.platformBiLogger.deleteNoteToSellerSf(__assign(__assign({}, biParams), {
                        catalogAppId: catalogAppId,
                        checkoutId: checkoutId
                    }));
            } else {
                hasNote
                    ?
                    _this.siteStore.biLogger.saveNoteToSellerSf(__assign(__assign({}, biParams), {
                        is_empty: false,
                        storeId: cart.storeId
                    })) :
                    _this.siteStore.biLogger.deleteNoteToSellerSf(__assign(__assign({}, biParams), {
                        storeId: cart.storeId
                    }));
            }
        };
        this.siteStore = siteStore;
        this.origin = origin;
    }
    Object.defineProperty(BIService.prototype, "baseParams", {
        get: function() {
            return {
                origin: this.origin,
            };
        },
        enumerable: false,
        configurable: true
    });
    return BIService;
}());
export {
    BIService
};
//# sourceMappingURL=BIService.js.map