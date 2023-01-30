import {
    __assign
} from "tslib";
import {
    MediaType
} from '../../types';
import {
    CartEvents
} from '../../types/cart';
export function newCartToOldCartStructure(newCart) {
    var oldCart = __assign({}, newCart);
    oldCart.items = (oldCart.items || []).map(function(item) {
        return (__assign(__assign(__assign({}, item), item.product), {
            media: item.product.media[0] || EmptyMedia
        }));
    });
    return oldCart;
}
var EmptyMedia = {
    altText: null,
    height: 0,
    width: 0,
    mediaType: MediaType.PHOTO,
    url: '',
};
var CartServices = /** @class */ (function() {
    function CartServices(sdkAdapter) {
        this.sdkAdapter = sdkAdapter;
        //
    }
    CartServices.prototype.notifyCartChange = function(cart, extraParams) {
        var cartOldStructure = __assign(__assign({}, newCartToOldCartStructure(cart)), {
            extraParams: extraParams
        });
        delete cartOldStructure.billingAddress;
        delete cartOldStructure.shippingAddress;
        this.sdkAdapter.publish(CartEvents.CHANGED, cartOldStructure, false);
    };
    CartServices.prototype.subscribeToCartChanges = function(listener) {
        this.sdkAdapter.subscribe(CartEvents.CHANGED, function(e) {
            return listener(e.data);
        }, false);
    };
    CartServices.prototype.subscribeToCartCleared = function(listener) {
        this.sdkAdapter.subscribe(CartEvents.CLEARED, function(e) {
            return listener(e.data);
        }, false);
    };
    return CartServices;
}());
export {
    CartServices
};
//# sourceMappingURL=cart-services.js.map