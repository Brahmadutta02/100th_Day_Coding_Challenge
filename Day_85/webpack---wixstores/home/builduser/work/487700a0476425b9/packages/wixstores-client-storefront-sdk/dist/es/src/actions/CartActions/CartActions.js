import {
    __assign,
    __awaiter,
    __extends,
    __generator,
    __rest
} from "tslib";
import {
    CommandsExecutor,
    AddToCartActionOption,
    PageMap,
    Topology,
    TrackEventName,
    CartEvents,
} from '@wix/wixstores-client-core';
import * as _ from 'lodash';
import {
    CartApi
} from '../../apis/CartApi/CartApi';
import {
    graphqlCartToCartSummary
} from '../../apis/CartApi/graphqlCartToCartSummary';
import {
    SPECS
} from '../../constants';
import {
    removeUndefinedKeys
} from '../../lib/removeUndefinedKeys';
import {
    getAdditionalFeesPrice,
    getCatalogAppIds,
    getItemsCount,
    getItemTypes,
    getNumberOfAdditionalFees,
} from '../../utils/cart/bi.utils';
import {
    BaseActions
} from '../BaseActions';
var CartActions = /** @class */ (function(_super) {
    __extends(CartActions, _super);

    function CartActions(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin;
        var _this = _super.call(this, {
            siteStore: siteStore,
            origin: origin
        }) || this;
        _this.commandsExecutor = new CommandsExecutor(Topology.CART_COMMANDS_URL, _this.siteStore.httpClient);
        _this.cartApi = new CartApi({
            siteStore: siteStore,
            origin: origin
        });
        return _this;
    }
    CartActions.prototype.addToCart = function(_a, reportData) {
        var productId = _a.productId,
            quantity = _a.quantity,
            _b = _a.addToCartAction,
            addToCartAction = _b === void 0 ? AddToCartActionOption.MINI_CART : _b,
            customTextFieldSelections = _a.customTextFieldSelections,
            optionsSelectionsIds = _a.optionsSelectionsIds,
            optionsSelectionsByNames = _a.optionsSelectionsByNames,
            _c = _a.onSuccess,
            onSuccess = _c === void 0 ? function() {
                return null;
            } : _c,
            subscriptionOptionId = _a.subscriptionOptionId,
            variantId = _a.variantId,
            preOrderRequested = _a.preOrderRequested;
        if (reportData === void 0) {
            reportData = {};
        }
        return __awaiter(this, void 0, void 0, function() {
            var cartSummary;
            return __generator(this, function(_d) {
                switch (_d.label) {
                    case 0:
                        return [4 /*yield*/ , this.addToCartAndReturnCartSummary({
                            customTextFieldSelections: customTextFieldSelections,
                            optionsSelectionsByNames: optionsSelectionsByNames,
                            optionsSelectionsIds: optionsSelectionsIds,
                            productId: productId,
                            quantity: quantity,
                            subscriptionOptionId: subscriptionOptionId,
                            variantId: variantId,
                            preOrderRequested: preOrderRequested,
                        })];
                    case 1:
                        cartSummary = _d.sent();
                        if (!cartSummary.cartId) {
                            throw Error('error when adding to cart');
                        }
                        this.reportAddToCart(__assign({
                            productId: productId,
                            hasOptions: Object.keys(optionsSelectionsByNames !== null && optionsSelectionsByNames !== void 0 ? optionsSelectionsByNames : {}).length > 0,
                            cartId: _.get(cartSummary, 'cartId', undefined),
                            quantity: quantity,
                            origin: this.origin
                        }, reportData));
                        return [2 /*return*/ , this.onAddToCartCompleted(cartSummary, addToCartAction, productId, onSuccess)];
                }
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/tslint/config
    CartActions.prototype.addToCartAndReturnCartSummary = function(_a) {
        var customTextFieldSelections = _a.customTextFieldSelections,
            optionsSelectionsByNames = _a.optionsSelectionsByNames,
            optionsSelectionsIds = _a.optionsSelectionsIds,
            productId = _a.productId,
            quantity = _a.quantity,
            subscriptionOptionId = _a.subscriptionOptionId,
            variantId = _a.variantId,
            preOrderRequested = _a.preOrderRequested;
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartApi.addToCart([{
                            productId: productId,
                            quantity: quantity,
                            variantId: variantId,
                            optionsSelectionsIds: optionsSelectionsIds,
                            optionsSelectionsByNames: optionsSelectionsByNames,
                            subscriptionOptionId: subscriptionOptionId,
                            customTextFieldSelections: customTextFieldSelections,
                            preOrderRequested: preOrderRequested,
                        }, ])];
                    case 1:
                        cart = _b.sent();
                        return [2 /*return*/ , graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartActions.prototype.shouldNavigateToCart = function() {
        return !this.siteStore.isMiniCartExists;
    };
    /*istanbul ignore next: todo: test */
    CartActions.prototype.onAddToCartCompleted = function(cartSummary, addToCartAction, productId, onSuccess) {
        if (addToCartAction === void 0) {
            addToCartAction = AddToCartActionOption.MINI_CART;
        }
        if (addToCartAction === AddToCartActionOption.NONE && !this.siteStore.isCartIconExists) {
            addToCartAction = AddToCartActionOption.MINI_CART;
        }
        this.publishCart(cartSummary, 'AddToCartCompleted', {
            shouldOpenCart: addToCartAction !== AddToCartActionOption.NONE && addToCartAction !== AddToCartActionOption.CART,
            addToCartActionOption: addToCartAction,
            addedProductId: productId,
        });
        onSuccess();
        if (addToCartAction === AddToCartActionOption.CART ||
            (addToCartAction !== AddToCartActionOption.NONE && this.shouldNavigateToCart())) {
            return this.navigateToCart(this.origin);
        }
    };
    CartActions.prototype.mergeAddToCartItemsProductId = function(items) {
        return items.reduce(function(acc, item) {
            var _a;
            acc.push({
                productId: (_a = item.productId) !== null && _a !== void 0 ? _a : item.productID,
                options: item.options,
                quantity: item.quantity,
                preOrderRequested: item.preOrderRequested,
            });
            return acc;
        }, []);
    };
    CartActions.prototype.publishCart = function(cartSummary, reason, eventOptions) {
        if (eventOptions === void 0) {
            eventOptions = {
                shouldOpenCart: false,
                addToCartActionOption: AddToCartActionOption.MINI_CART,
            };
        }
        var _a = cartSummary,
            _billingAddress = _a.billingAddress,
            _shippingAddress = _a.shippingAddress,
            publishableCart = __rest(_a, ["billingAddress", "shippingAddress"]);
        this.siteStore.pubSubManager.publish(CartEvents.CHANGED, __assign(__assign({}, publishableCart), {
            extraParams: {
                origin: this.origin
            },
            eventOptions: eventOptions,
            reason: reason
        }));
    };
    /* istanbul ignore next: todo: test */
    CartActions.prototype.navigateToCart = function(origin) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.siteStore.navigate({
                    sectionId: PageMap.CART,
                    queryParams: {
                        origin: origin
                    },
                }, true)];
            });
        });
    };
    CartActions.prototype.removeItemFromCart = function(_a, options) {
        var cartId = _a.cartId,
            cartItemId = _a.cartItemId,
            productId = _a.productId,
            productType = _a.productType,
            productName = _a.productName,
            price = _a.price,
            sku = _a.sku,
            quantity = _a.quantity,
            currency = _a.currency,
            catalogAppId = _a.catalogAppId;
        if (options === void 0) {
            options = {
                silent: false
            };
        }
        return __awaiter(this, void 0, void 0, function() {
            var cartSummary, biParams;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartApi.removeItem({
                            cartId: cartId,
                            cartItemId: cartItemId
                        })];
                    case 1:
                        cartSummary = _b.sent();
                        if (!options.silent) {
                            this.publishCart(cartSummary, 'removeItemFromCart', {
                                shouldOpenCart: false
                            });
                        }
                        biParams = {
                            cartId: cartId,
                            productId: productId,
                            productType: productType,
                            storeId: this.siteStore.msid,
                            origin: this.origin,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                            itemsCount: getItemsCount(cartSummary),
                        };
                        this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130) ?
                            this.siteStore.platformBiLogger.removedProductFromCartSf(__assign(__assign({}, biParams), {
                                catalogAppId: catalogAppId,
                                checkoutId: cartSummary.checkoutId
                            })) :
                            this.siteStore.biLogger.removedProductFromCartSf(biParams);
                        this.siteStore.trackEvent(TrackEventName.REMOVE_FROM_CART, {
                            id: productId,
                            name: productName,
                            price: price,
                            quantity: quantity,
                            sku: sku,
                            currency: currency,
                            type: productType,
                        });
                        return [2 /*return*/ ];
                }
            });
        });
    };
    /**
     * @deprecated. use EDM instead
     */
    CartActions.prototype.addCustomItemsToCart = function(customItems) {
        return __awaiter(this, void 0, void 0, function() {
            var customAmounts, response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        customAmounts = customItems.map(function(item) {
                            return {
                                name: item.name,
                                notes: item.note,
                                quantity: item.quantity,
                                amount: item.price,
                            };
                        });
                        return [4 /*yield*/ , this.commandsExecutor.execute('BulkAddDetailedCustomAmountV2', {
                            amounts: customAmounts,
                        })];
                    case 1:
                        response = _a.sent();
                        this.publishCart(response.data.cartSummary, 'addCustomItemsToCart', {
                            shouldOpenCart: false
                        });
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartActions.prototype.applyCouponToCart = function(_a) {
        var cartId = _a.cartId,
            couponCode = _a.couponCode,
            userIdentifier = _a.userIdentifier,
            isMember = _a.isMember;
        return __awaiter(this, void 0, void 0, function() {
            var cartSummary, biParams;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartApi.applyCoupon(cartId, couponCode, userIdentifier)];
                    case 1:
                        cartSummary = _b.sent();
                        this.publishCart(cartSummary, 'applyCouponToCart');
                        biParams = {
                            origin: this.origin,
                            cartId: cartId,
                            couponCode: couponCode,
                            storeId: this.siteStore.msid,
                            isMember: isMember,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                        };
                        this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130) ?
                            this.siteStore.platformBiLogger.clickApplyCoupon(__assign(__assign({}, biParams), {
                                catalogAppId: getCatalogAppIds(cartSummary),
                                checkoutId: cartSummary.checkoutId,
                                itemType: getItemTypes(cartSummary)
                            })) :
                            this.siteStore.biLogger.couponAppliedSf(__assign(__assign({}, biParams), {
                                storeId: this.siteStore.msid
                            }));
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartActions.prototype.removeCouponFromCart = function(_a) {
        var cartId = _a.cartId,
            couponId = _a.couponId,
            couponCode = _a.couponCode;
        return __awaiter(this, void 0, void 0, function() {
            var cartSummary, biParams;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartApi.removeCoupon({
                            cartId: cartId,
                            couponId: couponId
                        })];
                    case 1:
                        cartSummary = _b.sent();
                        this.publishCart(cartSummary, 'removeCouponFromCart');
                        biParams = {
                            origin: this.origin,
                            cartId: cartId,
                            couponId: couponId,
                            couponCode: couponCode,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                        };
                        this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130) ?
                            this.siteStore.platformBiLogger.removeACoupon(__assign(__assign({}, biParams), {
                                catalogAppId: getCatalogAppIds(cartSummary),
                                checkoutId: cartSummary.checkoutId,
                                itemType: getItemTypes(cartSummary)
                            })) :
                            this.siteStore.biLogger.removeACouponSf(__assign(__assign({}, biParams), {
                                storeId: this.siteStore.msid
                            }));
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartActions.prototype.updateLineItemQuantityInCart = function(_a, options) {
        var cartId = _a.cartId,
            cartItemId = _a.cartItemId,
            quantity = _a.quantity,
            productId = _a.productId,
            cartType = _a.cartType;
        if (options === void 0) {
            options = {
                silent: false
            };
        }
        return __awaiter(this, void 0, void 0, function() {
            var cartSummary, biParams;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartApi.updateItemQuantity({
                            cartId: cartId,
                            cartItemId: cartItemId,
                            quantity: quantity
                        })];
                    case 1:
                        cartSummary = _b.sent();
                        if (!options.silent) {
                            this.publishCart(cartSummary, 'updateLineItemQuantityInCart');
                        }
                        biParams = {
                            origin: this.origin,
                            productId: productId,
                            itemsCount: getItemsCount(cartSummary),
                            storeId: this.siteStore.msid,
                            cartId: cartId,
                            cartType: cartType,
                            additionalFeesPrice: getAdditionalFeesPrice(cartSummary),
                            numberOfAdditionalFees: getNumberOfAdditionalFees(cartSummary),
                        };
                        this.siteStore.experiments.enabled(SPECS.MoveCartBIEventsTo130) ?
                            this.siteStore.platformBiLogger.updatedCartItemQuantitySf(__assign(__assign({}, biParams), {
                                catalogAppId: getCatalogAppIds(cartSummary),
                                checkoutId: cartSummary.checkoutId
                            })) :
                            this.siteStore.biLogger.updatedCartItemQuantitySf(biParams);
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartActions.prototype.addProductToCartMutation = function(products) {
        return __awaiter(this, void 0, void 0, function() {
            var mappedProducts, graphqlCartResponse;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        mappedProducts = products.map(function(_a) {
                            var productId = _a.productId,
                                quantity = _a.quantity,
                                preOrderRequested = _a.preOrderRequested,
                                _b = _a.options,
                                options = _b === void 0 ? {} : _b;
                            return (__assign(__assign(__assign({
                                productId: productId,
                                quantity: quantity
                            }, (options.choices && {
                                optionsSelectionsByNames: options.choices
                            })), (options.customTextFields && {
                                customTextFieldSelections: options.customTextFields
                            })), (preOrderRequested ? {
                                preOrderRequested: preOrderRequested
                            } : {})));
                        });
                        return [4 /*yield*/ , this.cartApi.addToCart(mappedProducts)];
                    case 1:
                        graphqlCartResponse = _a.sent();
                        return [2 /*return*/ , graphqlCartToCartSummary(graphqlCartResponse)];
                }
            });
        });
    };
    CartActions.prototype.addProductsToCart = function(products, options) {
        if (options === void 0) {
            options = {
                silent: false
            };
        }
        return __awaiter(this, void 0, void 0, function() {
            var data;
            var _this = this;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        products = this.mergeAddToCartItemsProductId(products);
                        return [4 /*yield*/ , this.addProductToCartMutation(products)];
                    case 1:
                        data = _a.sent();
                        products.forEach(function(item) {
                            _this.reportAddToCart({
                                productId: item.productId,
                                hasOptions: !!_.get(item, 'options.choices[0]', false),
                                quantity: item.quantity,
                                cartId: data.cartId,
                                origin: _this.origin,
                            });
                        });
                        if (!options.silent) {
                            this.publishCart(data, 'addProductsToCart', {
                                shouldOpenCart: false
                            });
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartActions.prototype.reportAddToCart = function(_a) {
        var cartId = _a.cartId,
            _b = _a.category,
            category = _b === void 0 ? 'All Products' : _b,
            hasOptions = _a.hasOptions,
            name = _a.name,
            origin = _a.origin,
            price = _a.price,
            productId = _a.productId,
            quantity = _a.quantity,
            sku = _a.sku,
            type = _a.type,
            buttonType = _a.buttonType,
            appName = _a.appName,
            productType = _a.productType,
            isNavigateCart = _a.isNavigateCart,
            navigationClick = _a.navigationClick,
            impressionId = _a.impressionId,
            galleryProductsLogic = _a.galleryProductsLogic,
            rank = _a.rank,
            galleryInputId = _a.galleryInputId;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.clickOnAddToCartSf(removeUndefinedKeys({
            appName: appName,
            buttonType: buttonType,
            hasOptions: hasOptions,
            isNavigateCart: isNavigateCart,
            navigationClick: navigationClick,
            origin: origin,
            productId: productId,
            productType: productType,
            quantity: quantity,
            impressionId: impressionId,
            galleryProductsLogic: galleryProductsLogic,
            rank: rank,
            galleryInputId: galleryInputId,
        }));
        this.siteStore.trackEvent('AddToCart', removeUndefinedKeys({
            cartId: cartId,
            currency: this.siteStore.currency,
            id: productId,
            quantity: quantity,
            name: name,
            sku: sku,
            price: price,
            type: type,
            category: category,
        }));
    };
    CartActions.prototype.getCurrentCart = function() {
        return this.cartApi.fetchCart();
    };
    CartActions.prototype.reloadCart = function() {
        var _this = this;
        return this.cartApi
            .fetchCart()
            .then(function(cart) {
                return graphqlCartToCartSummary(cart);
            })
            .then(function(cartSummary) {
                return _this.publishCart(cartSummary, 'reloadCart', {
                    shouldOpenCart: false
                });
            });
    };
    return CartActions;
}(BaseActions));
export {
    CartActions
};
//# sourceMappingURL=CartActions.js.map