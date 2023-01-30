import {
    handleDirectPurchase
} from './handleDirectPurchase';
export var createCheckoutExports = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return ({
        handleDirectPurchase: handleDirectPurchase({
            context: context,
            origin: origin
        }),
    });
};
//# sourceMappingURL=wixcode.checkout.js.map