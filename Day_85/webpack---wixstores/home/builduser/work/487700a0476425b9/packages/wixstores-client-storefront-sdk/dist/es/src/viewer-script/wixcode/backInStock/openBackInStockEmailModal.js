import {
    backInStockActionsFactory
} from './common/backInStockActionsFactory';
export var openBackInStockEmailModal = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(_a) {
        var productId = _a.productId,
            variantId = _a.variantId;
        return backInStockActionsFactory({
            context: context,
            origin: origin,
            requireCompId: true
        }).openBackInStockEmailModal({
            productId: productId,
            variantId: variantId,
        });
    };
};
//# sourceMappingURL=openBackInStockEmailModal.js.map