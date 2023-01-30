import {
    CartActions
} from '../../../actions/CartActions/CartActions';
export var toCart = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function() {
        return new CartActions({
            siteStore: context.siteStore,
            origin: origin
        }).navigateToCart(origin);
    };
};
//# sourceMappingURL=toCart.js.map