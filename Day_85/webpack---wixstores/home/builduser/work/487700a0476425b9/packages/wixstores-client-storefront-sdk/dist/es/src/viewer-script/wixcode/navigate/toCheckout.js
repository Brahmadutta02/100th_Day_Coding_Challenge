import {
    CheckoutNavigationService
} from '../../../services/CheckoutNavigationService/CheckoutNavigationService';
export var toCheckout = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(args) {
        var _a;
        var params = {
            a11y: false,
            cartId: args.cartId,
            cashierPaymentId: args.paymentId,
            checkoutId: args.checkoutId,
            locale: context.siteStore.locale,
            deviceType: context.siteStore.isMobile() ? 'mobile' : 'desktop',
            isPickupOnly: false,
            originType: (_a = args.originType) !== null && _a !== void 0 ? _a : 'unknown',
            paymentMethodName: args.paymentMethodName,
            siteBaseUrl: context.siteStore.location.baseUrl,
            continueShoppingUrl: args.continueShoppingUrl,
        };
        return new CheckoutNavigationService({
            siteStore: context.siteStore,
            origin: origin
        }).navigateToCheckout(params);
    };
};
//# sourceMappingURL=toCheckout.js.map