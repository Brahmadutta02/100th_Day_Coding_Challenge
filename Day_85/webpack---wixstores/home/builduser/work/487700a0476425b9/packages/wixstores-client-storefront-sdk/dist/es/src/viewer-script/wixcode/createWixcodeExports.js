import {
    createCartExports
} from './cart/wixcode.cart';
// import {createEcomCartExports} from './ecomCart/wixcode.ecomCart';
import {
    createCheckoutExports
} from './checkout/wixcode.checkout';
import {
    createNavigateExports
} from './navigate/wixcode.navigate';
import {
    createProductExports
} from './product/wixcode.product';
import {
    createBackInStockExports
} from './backInStock/wixcode.backInStock';
import {
    createSettingsExports
} from './settings/wixcode.settings';
import {
    createPaymentsExports
} from './payments/wixcode.payments';
import {
    createWishlistExports
} from './wishlist/wixcode.wishlist';
export var createWixcodeExports = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return ({
        cart: createCartExports({
            context: context,
            origin: origin
        }),
        // ecomCart: createEcomCartExports({context, origin}),
        navigate: createNavigateExports({
            context: context,
            origin: origin
        }),
        product: createProductExports({
            context: context,
            origin: origin
        }),
        checkout: createCheckoutExports({
            context: context,
            origin: origin
        }),
        backInStock: createBackInStockExports({
            context: context,
            origin: origin
        }),
        settings: createSettingsExports({
            context: context,
            origin: origin
        }),
        payments: createPaymentsExports({
            context: context,
            origin: origin
        }),
        wishlist: createWishlistExports({
            context: context,
            origin: origin
        }),
    });
};
//# sourceMappingURL=createWixcodeExports.js.map