import {
    __awaiter,
    __extends,
    __generator,
    __read,
    __values
} from "tslib";
import {
    BaseActions
} from '../BaseActions';
import {
    BackInStockApi
} from '../../apis/BackInStockApi/BackInStockApi';
import {
    APP_DEFINITION_ID as STORES_APP_DEF_ID
} from '@wix/wixstores-client-core';
var BackInStockActions = /** @class */ (function(_super) {
    __extends(BackInStockActions, _super);

    function BackInStockActions(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin,
            compId = _a.compId;
        var _this = _super.call(this, {
            siteStore: siteStore,
            origin: origin
        }) || this;
        _this.compId = compId;
        _this.backInStockApi = new BackInStockApi({
            siteStore: siteStore,
            origin: origin
        });
        return _this;
    }
    BackInStockActions.prototype.openBackInStockEmailModal = function(_a) {
        var productId = _a.productId,
            variantId = _a.variantId;
        return __awaiter(this, void 0, void 0, function() {
            var modalOpenParam, modalOptions;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        this.trackFedOpsOpenModalStart();
                        modalOpenParam = {
                            options_variantId: variantId,
                            catalogItemId: productId,
                            appDefId: STORES_APP_DEF_ID,
                            instance: this.siteStore.instanceManager.getInstance(),
                            layoutDir: this.siteStore.layoutDirection,
                        };
                        modalOptions = {
                            width: 603,
                            height: 348,
                            theme: 'BARE',
                        };
                        return [4 /*yield*/ , this.siteStore.windowApis.openModal(BackInStockActions.getBackInStockModalUrl(modalOpenParam), modalOptions, this.compId)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    /**
     * @deprecated: Use fetchBackInStockSettings instead
     */
    BackInStockActions.prototype.fetchIsBackInStockEnabled = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.backInStockApi.getBackInStockSettings()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.backInStock.settings.isCollectingRequests];
                }
            });
        });
    };
    BackInStockActions.prototype.fetchBackInStockSettings = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.backInStockApi.getBackInStockSettings()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.backInStock.settings];
                }
            });
        });
    };
    BackInStockActions.prototype.trackFedOpsOpenModalStart = function() {
        var logger = this.siteStore.platformServices.fedOpsLoggerFactory.getLoggerForWidget({
            appName: BackInStockActions.BACK_IN_STOCK_MODAL_APP_NAME,
        });
        logger.interactionStarted(BackInStockActions.BACK_IN_STOCK_MODAL_OPENED_INTERACTION);
        logger.flush();
    };
    BackInStockActions.getBackInStockModalUrl = function(openParams) {
        var e_1, _a;
        var url = new URL("https://ecom.wix.com/back-in-stock-request-modal");
        try {
            for (var _b = __values(Object.entries(openParams)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2),
                    key = _d[0],
                    value = _d[1];
                /* istanbul ignore else */
                if (value) {
                    url.searchParams.append(key, value);
                }
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        return url.toString();
    };
    BackInStockActions.BACK_IN_STOCK_MODAL_APP_NAME = 'back-in-stock-request-modal';
    BackInStockActions.BACK_IN_STOCK_MODAL_OPENED_INTERACTION = 'open-request-modal';
    return BackInStockActions;
}(BaseActions));
export {
    BackInStockActions
};
//# sourceMappingURL=BackInStockActions.js.map