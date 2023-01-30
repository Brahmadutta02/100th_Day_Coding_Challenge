import {
    toCart
} from './toCart';
import {
    toCheckout
} from './toCheckout';
import {
    toThankYouPage
} from './toThankYouPage';
import {
    toProductPage
} from './toProductPage';
export var createNavigateExports = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return {
        toCart: toCart({
            context: context,
            origin: origin
        }),
        toCheckout: toCheckout({
            context: context,
            origin: origin
        }),
        toThankYouPage: toThankYouPage({
            context: context,
            origin: origin
        }),
        toProductPage: toProductPage({
            context: context,
            origin: origin
        }),
    };
};
//# sourceMappingURL=wixcode.navigate.js.map