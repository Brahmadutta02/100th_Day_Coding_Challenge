import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import {
    APP_DEFINITION_ID,
    PageMap,
    ModalManager
} from '@wix/wixstores-client-core';
import {
    baseModalUrl,
    ModalType
} from './constants';
import _ from 'lodash';
import {
    MultilingualService
} from '../MultilingualService/MultilingualService';
import {
    getCheckoutOutOfViewerUrl
} from './getCheckoutOutOfViewerUrl';
import {
    isWorker
} from '../../viewer-script/utils';
import {
    CheckoutNavigationApi
} from '../../apis/CheckoutNavigationApi/CheckoutNavigationApi';
import {
    ONE_HUNDRED_THOUSAND,
    SPECS
} from '../../constants';
import {
    getAdditionalFeesPrice,
    getCatalogAppIds,
    getNumberOfAdditionalFees
} from '../../utils/cart/bi.utils';
import {
    graphqlCartToCartSummary
} from '../../apis/CartApi/graphqlCartToCartSummary';
var CheckoutNavigationService = /** @class */ (function() {
    function CheckoutNavigationService(_a) {
        var _this = this;
        var siteStore = _a.siteStore,
            origin = _a.origin;
        this.openModal = function(url, width, height) {
            return __awaiter(_this, void 0, void 0, function() {
                var _a;
                return __generator(this, function(_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/ , this.siteStore.windowApis.openModal(url, {
                                width: width,
                                height: height,
                                theme: "BARE" /* BARE */
                            })];
                        case 1:
                            return [2 /*return*/ , (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.message];
                    }
                });
            });
        };
        this.navigateToCheckoutOutViewer = function(checkoutInfo) {
            var commonConfig = self.commonConfig || null;
            var checkoutUrl = getCheckoutOutOfViewerUrl({
                cashierPaymentId: checkoutInfo.cashierPaymentId,
                isA11y: checkoutInfo.a11y,
                instance: _this.siteStore.instanceManager.getInstance(),
                locale: checkoutInfo.locale,
                payment: checkoutInfo.paymentMethodName,
                storeId: _this.siteStore.storeId,
                isPickUpFlow: checkoutInfo.isPickupOnly,
                cartId: checkoutInfo.cartId,
                deviceType: checkoutInfo.deviceType,
                isPrimaryLanguage: _this.multilingualService.isPrimaryLanguage,
                lang: _this.multilingualService.lang,
                country: _this.multilingualService.locale,
                origin: _this.origin,
                originType: checkoutInfo.originType,
                consentPolicy: _this.siteStore.usersApi.getCurrentConsentPolicy(),
                consentPolicyHeader: _this.siteStore.usersApi._getConsentPolicyHeader(),
                checkoutId: checkoutInfo.checkoutId,
                continueShoppingUrl: checkoutInfo.continueShoppingUrl,
                commonConfig: commonConfig,
            });
            if (isWorker() && !!_this.siteStore.location.to) {
                _this.siteStore.location.to(checkoutUrl);
            } else {
                window.open(checkoutUrl, '_top');
            }
        };
        this.isEligibleForCheckoutInViewer = function() {
            return __awaiter(_this, void 0, void 0, function() {
                var isCheckoutInstalled, url, isSslSecured;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/ , this.siteStore.siteApis.isAppSectionInstalled({
                                appDefinitionId: APP_DEFINITION_ID,
                                sectionId: PageMap.CHECKOUT,
                            })];
                        case 1:
                            isCheckoutInstalled = _a.sent();
                            url = this.siteStore.location.url;
                            isSslSecured = _.startsWith(url, 'https');
                            return [2 /*return*/ , isCheckoutInstalled && isSslSecured];
                    }
                });
            });
        };
        this.sendLostBusinessEmail = function(isPremium) {
            isPremium && _this.checkoutNavigationApi.notifyLostBusinessNotifier();
        };
        this.isSubscriptionsPremiumFeature = function() {
            return (_.findIndex(_this.siteStore.premiumFeatures, function(feature) {
                return feature.name === 'stores_subscriptions';
            }) !== -1);
        };
        this.origin = origin;
        this.siteStore = siteStore;
        this.multilingualService = new MultilingualService(this.siteStore);
        this.checkoutNavigationApi = new CheckoutNavigationApi({
            siteStore: this.siteStore,
            origin: this.origin
        });
        this.modalManger = new ModalManager({
            openModal: this.openModal
        }, baseModalUrl, this.siteStore.instanceManager.getInstance());
    }
    CheckoutNavigationService.prototype.openModalByType = function(modalType, isEditorX, cart) {
        return __awaiter(this, void 0, void 0, function() {
            var biParams, cartSummary, additionalFeesPrice, additionalFeesNumber, mode, _a, response;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        biParams = {
                            origin: this.origin,
                            isMerchant: true
                        };
                        cartSummary = graphqlCartToCartSummary(cart);
                        additionalFeesPrice = getAdditionalFeesPrice(cartSummary);
                        additionalFeesNumber = getNumberOfAdditionalFees(cartSummary);
                        mode = this.siteStore.biStorefrontViewMode;
                        _a = modalType;
                        switch (_a) {
                            case ModalType.SetShipping:
                                return [3 /*break*/ , 1];
                            case ModalType.SetPayment:
                                return [3 /*break*/ , 2];
                            case ModalType.CantShipToDestination:
                                return [3 /*break*/ , 3];
                            case ModalType.UpgradeToPremium:
                                return [3 /*break*/ , 4];
                            case ModalType.NotInLiveSite:
                                return [3 /*break*/ , 6];
                            case ModalType.Subscriptions:
                                return [3 /*break*/ , 7];
                            case ModalType.HighArpuSubscriptions:
                                return [3 /*break*/ , 8];
                            case ModalType.NoOnlinePayments:
                                return [3 /*break*/ , 9];
                        }
                        return [3 /*break*/ , 10];
                    case 1:
                        {
                            this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130) ?
                            void this.siteStore.platformBiLogger.cartShowMerchantShippingPopup({
                                type: 'merchant pop-up',
                                origin: this.origin,
                                catalogAppId: getCatalogAppIds(cartSummary),
                                mode: mode,
                            }) :
                                void this.siteStore.biLogger.showShippingPopupSf(__assign({
                                type: 'merchant pop-up',
                                mode: mode
                            }, biParams));
                            return [2 /*return*/ , this.modalManger.openSetShippingMethod()];
                        }
                        _b.label = 2;
                    case 2:
                        {
                            void this.siteStore.biLogger.showMerchantPaymentPopupSf(biParams);
                            void this.siteStore.platformBiLogger.checkoutShowMerchantPaymentPopupSf(biParams);
                            return [2 /*return*/ , this.modalManger.openSetPaymentMethod()];
                        }
                        _b.label = 3;
                    case 3:
                        {
                            return [2 /*return*/ , this.modalManger.openCantShipToDestination({
                                countryKey: cart.destination.country,
                                subdivisionKey: cart.destination.subdivision,
                            })];
                        }
                        _b.label = 4;
                    case 4:
                        //eslint-disable-next-line @typescript-eslint/no-floating-promises
                        this.siteStore.biLogger.showMerchantUpgradePopupSf(biParams);
                        return [4 /*yield*/ , this.modalManger.openUpgradeToPremium({
                            isEditorX: Boolean(isEditorX)
                        })];
                    case 5:
                        response = _b.sent();
                        if (response === null || response === void 0 ? void 0 : response.proceed) {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.clickNoThanksOnMerchantUpgradePopupSf({});
                        }
                        return [2 /*return*/ , response];
                    case 6:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.viewCheckoutInLiveSitePopupSf(biParams);
                            return [2 /*return*/ , this.modalManger.openNotInLiveSite()];
                        }
                        _b.label = 7;
                    case 7:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.notAcceptPaymentsVisitorPopupSf({
                                origin: this.origin
                            });
                            this.siteStore.platformBiLogger.checkoutNotAbleToAcceptPaymentsVisitorPopupSf({
                                origin: this.origin,
                                additionalFeesPrice: additionalFeesPrice * ONE_HUNDRED_THOUSAND,
                                numberOfAdditionalFees: additionalFeesNumber,
                            });
                            return [2 /*return*/ , this.modalManger.openSubscriptions()];
                        }
                        _b.label = 8;
                    case 8:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.subscriptionsAreComingSoonVisitorPopupSf({
                                origin: this.origin
                            });
                            return [2 /*return*/ , this.modalManger.openUpgradeSubscriptions({
                                isEditorX: Boolean(isEditorX)
                            })];
                        }
                        _b.label = 9;
                    case 9:
                        {
                            //eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.siteStore.biLogger.notAcceptPaymentsVisitorPopupSf({
                                origin: this.origin
                            });
                            this.siteStore.platformBiLogger.checkoutNotAbleToAcceptPaymentsVisitorPopupSf({
                                origin: this.origin,
                                additionalFeesPrice: additionalFeesPrice * ONE_HUNDRED_THOUSAND,
                                numberOfAdditionalFees: additionalFeesNumber,
                            });
                            return [2 /*return*/ , this.modalManger.openNoOnlinePayments()];
                        }
                        _b.label = 10;
                    case 10:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    /* eslint-disable sonarjs/cognitive-complexity */
    CheckoutNavigationService.prototype.checkIsAllowedToCheckout = function(_a) {
        var areAllItemsDigital = _a.areAllItemsDigital,
            isPremium = _a.isPremium,
            canStoreShip = _a.canStoreShip,
            hasCreatedPaymentMethods = _a.hasCreatedPaymentMethods,
            isSubscribe = _a.isSubscribe,
            canShipToDestination = _a.canShipToDestination,
            fullPaymentOffline = _a.fullPaymentOffline,
            hasShippableItems = _a.hasShippableItems;
        var isShippingNeeded = this.siteStore.experiments.enabled(SPECS.ReplaceIsDigitalWithHasShippableOnNavigateToCheckoutValidation) ?
            hasShippableItems :
            !areAllItemsDigital;
        var canStoreShipIfNeeded = !isShippingNeeded || canStoreShip;
        var isOwner = this.siteStore.isOwner;
        var isLiveSite = !(this.siteStore.isPreviewMode() || this.siteStore.isEditorMode());
        var needsAndHasPaymentMethods = !!hasCreatedPaymentMethods || !!fullPaymentOffline;
        if (!isLiveSite || isOwner) {
            if (!canStoreShipIfNeeded) {
                return {
                    modalType: ModalType.SetShipping,
                    canCheckout: false
                };
            } else if (!canShipToDestination) {
                return {
                    modalType: ModalType.CantShipToDestination,
                    canCheckout: false
                };
            } else if (!hasCreatedPaymentMethods) {
                return {
                    modalType: ModalType.SetPayment,
                    canCheckout: false
                };
            } else if (!isPremium) {
                return {
                    modalType: ModalType.UpgradeToPremium,
                    canCheckout: false
                };
            } else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
                return {
                    modalType: ModalType.HighArpuSubscriptions,
                    canCheckout: false
                };
            } else if (!isLiveSite) {
                return {
                    modalType: ModalType.NotInLiveSite,
                    canCheckout: false
                };
            }
        } else if (!canShipToDestination) {
            return {
                modalType: ModalType.CantShipToDestination,
                canCheckout: false
            };
        } else if (!isPremium || !needsAndHasPaymentMethods || !canStoreShipIfNeeded) {
            this.sendLostBusinessEmail(isPremium);
            return {
                modalType: ModalType.NoOnlinePayments,
                canCheckout: false
            };
        } else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
            return {
                modalType: ModalType.Subscriptions,
                canCheckout: false
            };
        }
        return {
            canCheckout: true
        };
    };
    CheckoutNavigationService.prototype.checkoutInfoToQueryParams = function(checkoutInfo) {
        var _a;
        return __assign(__assign({
            a11y: checkoutInfo.a11y,
            cartId: checkoutInfo.cartId,
            storeUrl: checkoutInfo.siteBaseUrl,
            isPickupFlow: checkoutInfo.isPickupOnly,
            cashierPaymentId: (_a = checkoutInfo.cashierPaymentId) !== null && _a !== void 0 ? _a : '',
            origin: this.origin,
            originType: checkoutInfo.originType
        }, (checkoutInfo.checkoutId ? {
            checkoutId: checkoutInfo.checkoutId
        } : {})), (checkoutInfo.continueShoppingUrl ? {
            continueShoppingUrl: checkoutInfo.continueShoppingUrl
        } : {}));
    };
    CheckoutNavigationService.prototype.navigateToCheckout = function(checkoutInfo) {
        var _a;
        return __awaiter(this, void 0, void 0, function() {
            var isVisitor, isCheckoutFastFlowOOI, isCheckoutVisitorPickupFlowOOI, useNewCheckout;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.isEligibleForCheckoutInViewer()];
                    case 1:
                        if (!(_b.sent())) {
                            return [2 /*return*/ , this.navigateToCheckoutOutViewer(checkoutInfo)];
                        }
                        isVisitor = !((_a = this.siteStore.usersApi.currentUser) === null || _a === void 0 ? void 0 : _a.loggedIn);
                        isCheckoutFastFlowOOI = this.siteStore.experiments.enabled(SPECS.UseNewCheckoutInFastFlow) && !!checkoutInfo.cashierPaymentId;
                        isCheckoutVisitorPickupFlowOOI = this.siteStore.experiments.enabled(SPECS.UseNewCheckoutInVisitorPickup) && checkoutInfo.isPickupOnly && isVisitor;
                        useNewCheckout = (isCheckoutFastFlowOOI || isCheckoutVisitorPickupFlowOOI) && !checkoutInfo.forceIframe;
                        this.siteStore.navigate(__assign({
                            sectionId: PageMap.CHECKOUT,
                            queryParams: this.checkoutInfoToQueryParams(checkoutInfo)
                        }, (useNewCheckout && {
                            urlParams: {
                                checkoutOOI: 'true'
                            }
                        })), true);
                        return [2 /*return*/ ];
                }
            });
        });
    };
    return CheckoutNavigationService;
}());
export {
    CheckoutNavigationService
};
//# sourceMappingURL=CheckoutNavigationService.js.map