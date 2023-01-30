import {
    BackInStockActions
} from '../../../../actions/BackInStockActions/BackInStockActions';
import {
    getCartIconControllerConfig
} from '../../getCartIconControllerConfig';
export function backInStockActionsFactory(_a) {
    var _b;
    var context = _a.context,
        origin = _a.origin,
        _c = _a.requireCompId,
        requireCompId = _c === void 0 ? false : _c;
    var compId = (_b = getCartIconControllerConfig(context)) === null || _b === void 0 ? void 0 : _b.compId;
    if (requireCompId && !compId) {
        throw new Error('Cart Icon compId was not acquired');
    }
    return new BackInStockActions({
        siteStore: context.siteStore,
        origin: origin,
        compId: compId !== null && compId !== void 0 ? compId : '',
    });
}
//# sourceMappingURL=backInStockActionsFactory.js.map