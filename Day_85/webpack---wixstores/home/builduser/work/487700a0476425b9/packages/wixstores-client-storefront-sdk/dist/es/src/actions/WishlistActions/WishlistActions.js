import {
    WishlistServer
} from '@wix/ambassador-wishlist-server/http';
import {
    Topology
} from '@wix/wixstores-client-core';
var WishlistActions = /** @class */ (function() {
    /* istanbul ignore next: todo: test headers once it will be possible with ambassador http testkit */
    function WishlistActions(headers) {
        if (headers === void 0) {
            headers = {};
        }
        this.headers = headers;
        this.service = WishlistServer(Topology.WISHLIST_BASE_URL).Wishlist();
    }
    WishlistActions.prototype.items = function(ids) {
        return ids.map(function(id) {
            return ({
                type: 'product',
                origin: 'wixstores',
                id: id
            });
        });
    };
    WishlistActions.prototype.addProducts = function(productIds) {
        return this.service(this.headers).addToWishlist({
            items: this.items(productIds)
        });
    };
    WishlistActions.prototype.removeProducts = function(productIds) {
        return this.service(this.headers).removeFromWishlist({
            items: this.items(productIds)
        });
    };
    WishlistActions.prototype.getWishlist = function() {
        return this.service(this.headers).getWishlist({
            kind: [{
                type: 'product',
                origin: 'wixstores'
            }]
        });
    };
    return WishlistActions;
}());
export {
    WishlistActions
};
//# sourceMappingURL=WishlistActions.js.map