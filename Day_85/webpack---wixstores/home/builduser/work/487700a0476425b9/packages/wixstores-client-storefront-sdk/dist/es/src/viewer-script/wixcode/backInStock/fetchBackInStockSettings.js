import {
    backInStockActionsFactory
} from './common/backInStockActionsFactory';
export var fetchBackInStockSettings = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function() {
        return backInStockActionsFactory({
            context: context,
            origin: origin
        }).fetchBackInStockSettings();
    };
};
//# sourceMappingURL=fetchBackInStockSettings.js.map