import {
    __awaiter,
    __generator
} from "tslib";
import {
    DirectPurchaseService
} from '../../../services/DirectPurchaseService/DirectPurchaseService';
export var handleDirectPurchase = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(args) {
        return __awaiter(void 0, void 0, void 0, function() {
            return __generator(this, function(_a) {
                // TODO - add arguments validation
                return [2 /*return*/ , new DirectPurchaseService({
                    siteStore: context.siteStore,
                    origin: origin,
                }).handleDirectPurchase(args)];
            });
        });
    };
};
//# sourceMappingURL=handleDirectPurchase.js.map