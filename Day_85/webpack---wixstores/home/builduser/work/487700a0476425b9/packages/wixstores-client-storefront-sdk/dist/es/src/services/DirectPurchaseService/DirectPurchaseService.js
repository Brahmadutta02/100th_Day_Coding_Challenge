import {
    __awaiter,
    __generator
} from "tslib";
import {
    CheckoutNavigationService
} from '../CheckoutNavigationService/CheckoutNavigationService';
import {
    CartApi
} from '../../apis/CartApi/CartApi';
import {
    StoreMetaDataApi
} from '../../apis/StoreMetaDataApi/StoreMetaDataApi';
import {
    ProductType
} from '@wix/wixstores-client-core';
var DirectPurchaseService = /** @class */ (function() {
    function DirectPurchaseService(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin;
        this.isValidVolatileCart = function(cart) {
            //new cart response is not returning lineItems - https://jira.wixpress.com/browse/EE-40720
            //for now, change to check for checkoutId
            //return cart.lineItems !== null && cart.lineItems.length > 0;
            return !!cart.checkoutId;
        };
        this.siteStore = siteStore;
        this.origin = origin;
        this.checkoutNavigationService = new CheckoutNavigationService({
            siteStore: this.siteStore,
            origin: this.origin
        });
        this.storeMetaDataApi = new StoreMetaDataApi({
            siteStore: this.siteStore,
            origin: this.origin
        });
        this.cartApi = new CartApi({
            siteStore: siteStore,
            origin: origin
        });
    }
    DirectPurchaseService.prototype.getStoreMetaData = function() {
        return this.storeMetaDataApi.getStoreMetaData();
    };
    DirectPurchaseService.prototype.handleDirectPurchase = function(_a) {
        var productId = _a.productId,
            _b = _a.withNavigateToCheckout,
            withNavigateToCheckout = _b === void 0 ? true : _b,
            /* istanbul ignore next */
            _c = _a.productType,
            /* istanbul ignore next */
            productType = _c === void 0 ? ProductType.UNRECOGNISED : _c,
            /* istanbul ignore next */
            _d = _a.quantity,
            /* istanbul ignore next */
            quantity = _d === void 0 ? 1 : _d,
            /* istanbul ignore next */
            _e = _a.customTextFieldSelection,
            /* istanbul ignore next */
            customTextFieldSelection = _e === void 0 ? [] : _e,
            /* istanbul ignore next */
            _f = _a.optionSelectionId,
            /* istanbul ignore next */
            optionSelectionId = _f === void 0 ? [] : _f,
            /* istanbul ignore next */
            _g = _a.locale,
            /* istanbul ignore next */
            locale = _g === void 0 ? 'en' : _g,
            /* istanbul ignore next */
            _h = _a.a11y,
            /* istanbul ignore next */
            a11y = _h === void 0 ? false : _h,
            /* istanbul ignore next */
            _j = _a.buyerNote,
            /* istanbul ignore next */
            buyerNote = _j === void 0 ? '' : _j,
            /* istanbul ignore next */
            _k = _a.deviceType,
            /* istanbul ignore next */
            deviceType = _k === void 0 ? 'desktop' : _k,
            /* istanbul ignore next */
            _l = _a.isPickupOnly,
            /* istanbul ignore next */
            isPickupOnly = _l === void 0 ? false : _l,
            /* istanbul ignore next */
            _m = _a.originType,
            /* istanbul ignore next */
            originType = _m === void 0 ? 'unknown' : _m,
            /* istanbul ignore next */
            _o = _a.siteBaseUrl,
            /* istanbul ignore next */
            siteBaseUrl = _o === void 0 ? '' : _o,
            /* istanbul ignore next */
            _p = _a.subscriptionOptionId,
            /* istanbul ignore next */
            subscriptionOptionId = _p === void 0 ? null : _p,
            /* istanbul ignore next */
            _q = _a.variantId,
            /* istanbul ignore next */
            variantId = _q === void 0 ? null : _q,
            /* istanbul ignore next */
            _r = _a.options,
            /* istanbul ignore next */
            options = _r === void 0 ? null : _r;
        return __awaiter(this, void 0, void 0, function() {
            var _s, isPremium, canStoreShip, hasCreatedPaymentMethods, isPickupOnlySettings, _t, canCheckout, modalType, volatileCart;
            return __generator(this, function(_u) {
                switch (_u.label) {
                    case 0:
                        return [4 /*yield*/ , this.getStoreMetaData()];
                    case 1:
                        _s = _u.sent(), isPremium = _s.isPremium, canStoreShip = _s.canStoreShip, hasCreatedPaymentMethods = _s.hasCreatedPaymentMethods, isPickupOnlySettings = _s.isPickupOnly;
                        _t = this.checkoutNavigationService.checkIsAllowedToCheckout({
                            areAllItemsDigital: productType === ProductType.DIGITAL,
                            isPremium: Boolean(isPremium),
                            canStoreShip: canStoreShip,
                            hasCreatedPaymentMethods: hasCreatedPaymentMethods,
                            isSubscribe: false,
                            canShipToDestination: true,
                            hasShippableItems: productType === ProductType.PHYSICAL,
                        }), canCheckout = _t.canCheckout, modalType = _t.modalType;
                        if (!canCheckout) {
                            void this.checkoutNavigationService.openModalByType(modalType, true);
                            throw Error("this store is not eligible for checkout (" + modalType + ")");
                        }
                        return [4 /*yield*/ , this.cartApi.createVolatileCart({
                            productId: productId,
                            optionSelectionId: optionSelectionId,
                            customTextFieldSelection: customTextFieldSelection,
                            quantity: quantity,
                            buyerNote: buyerNote,
                            subscriptionOptionId: subscriptionOptionId,
                            variantId: variantId,
                            isPickupOnly: isPickupOnly || !!isPickupOnlySettings,
                            options: options,
                        })];
                    case 2:
                        volatileCart = _u.sent();
                        if (!this.isValidVolatileCart(volatileCart)) {
                            throw Error('cannot checkout an empty cart');
                        }
                        if (!withNavigateToCheckout) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , this.checkoutNavigationService.navigateToCheckout({
                            checkoutId: volatileCart.checkoutId,
                            cartId: volatileCart.id,
                            a11y: a11y,
                            isPickupOnly: isPickupOnly,
                            deviceType: deviceType,
                            originType: originType,
                            locale: locale,
                            siteBaseUrl: siteBaseUrl,
                        })];
                    case 3:
                        _u.sent();
                        _u.label = 4;
                    case 4:
                        return [2 /*return*/ , {
                            cartId: volatileCart.id,
                            checkoutId: volatileCart.checkoutId
                        }];
                }
            });
        });
    };
    return DirectPurchaseService;
}());
export {
    DirectPurchaseService
};
//# sourceMappingURL=DirectPurchaseService.js.map