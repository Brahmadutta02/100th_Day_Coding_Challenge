import {
    __awaiter,
    __generator
} from "tslib";
import {
    getCartIconControllerConfig
} from '../getCartIconControllerConfig';
import {
    QuickViewActions
} from '../../../actions/QuickViewActions/QuickViewActions';
import {
    getSlugByProductId
} from './common/getSlugByProductId';
export var openQuickView = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(productId, options) {
        return __awaiter(void 0, void 0, void 0, function() {
            var cartIconControllerConfig, compId, config, slug;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        cartIconControllerConfig = getCartIconControllerConfig(context);
                        if (context.siteStore.isMobile()) {
                            throw Error('Cannot open quick-view in mobile');
                        }
                        if (!cartIconControllerConfig) {
                            throw Error('Cannot use openQuickView() without cart-icon on site');
                        }
                        compId = cartIconControllerConfig.compId, config = cartIconControllerConfig.config;
                        return [4 /*yield*/ , getSlugByProductId(productId, {
                            context: context,
                            origin: origin
                        })];
                    case 1:
                        slug = _a.sent();
                        return [2 /*return*/ , new QuickViewActions(context.siteStore).quickViewProduct({
                            origin: origin,
                            urlPart: slug,
                            compId: compId,
                            externalId: config.externalId,
                            selectionIds: [],
                            quantity: options === null || options === void 0 ? void 0 : options.quantity,
                        })];
                }
            });
        });
    };
};
//# sourceMappingURL=openQuickView.js.map