import {
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    GraphQLOperations,
    RemoteSourceTypes,
    RestCommands
} from '../constants';
import {
    query as setCartSelectedShippingOption
} from '../../graphql/setCartSelectedShippingOption.graphql';
import {
    query as setDestinationForEstimation
} from '../../graphql/setDestinationForEstimation.graphql';
import {
    query as addToCartMutation
} from '../../graphql/addToCart.graphql';
import {
    query as setCouponMutation
} from '../../graphql/setCoupon.graphql';
import {
    query as removeCouponMutation
} from '../../graphql/removeCoupon.graphql';
import {
    query as updateBuyerNoteMutation
} from '../../graphql/updateBuyerNote.graphql';
import {
    query as removeCartItemMutationQuery
} from '../../graphql/removeCartItem.graphql';
import {
    query as updateCartItemQuantityQuery
} from '../../graphql/updateCartItemQuantity.graphql';
import {
    query as createVolatileCartQuery
} from '../../graphql/createVolatileCart.graphql';
import {
    BaseApi
} from '../BaseApi';
import {
    graphqlCartToCartSummary
} from './graphqlCartToCartSummary';
import _ from 'lodash';
import {
    GetLegacyCartDocument,
} from '../../graphql/__generated__/getLegacyCart';
import {
    BIService
} from '../BIService';
import {
    GetLegacyCartOrCheckoutDocument,
} from '../../graphql/__generated__/getLegacyCartOrCheckout';
import {
    GetCartDocument
} from '../../graphql/__generated__/getCart';
var CartApi = /** @class */ (function(_super) {
    __extends(CartApi, _super);

    function CartApi(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin;
        var _this = _super.call(this, {
            siteStore: siteStore,
            origin: origin
        }) || this;
        _this.biService = new BIService({
            siteStore: siteStore,
            origin: origin
        });
        return _this;
    }
    CartApi.prototype.commandPost = function(command, data) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.post(this.endpoints.cartCommmands(command), data)];
            });
        });
    };
    CartApi.prototype.createVolatileCart = function(variables) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.mutate({
                            variables: variables,
                            query: createVolatileCartQuery,
                            operationName: GraphQLOperations.CreateCart,
                        })];
                    case 1:
                        return [2 /*return*/ , (_a.sent()).checkout.createCart];
                }
            });
        });
    };
    CartApi.prototype.addToCart = function(inputs) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (!inputs || inputs.length === 0) {
                            throw Error('Invalid addToCart request (no items were specified to be added to the cart)');
                        }
                        inputs.forEach(function(input) {
                            if (!input.productId) {
                                throw Error('Invalid product id (should be a GUID)');
                            }
                            if (!Number.isInteger(input.quantity) || input.quantity < 1) {
                                throw Error('Invalid quantity (should be rational and greater than 0)');
                            }
                            if (input.customTextFieldSelections && input.customTextFieldSelections.length > 0) {
                                input.customTextFieldSelections.forEach(function(field) {
                                    field.title = String(field.title);
                                    field.value = String(field.value);
                                });
                            }
                        });
                        return [4 /*yield*/ , this.mutate({
                            variables: {
                                params: inputs
                            },
                            query: addToCartMutation,
                            operationName: GraphQLOperations.AddToCart,
                        }, function(response) {
                            return _.get(response, 'data.cart.addToCart.errors[0].message', null);
                        })];
                    case 1:
                        return [2 /*return*/ , (_a.sent()).cart.addToCart.cart];
                }
            });
        });
    };
    CartApi.prototype.fetchCart = function(variables, source) {
        if (variables === void 0) {
            variables = {
                locale: 'en',
                withTax: false,
                withShipping: false,
            };
        }
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: variables,
                            query: GetCartDocument,
                            operationName: GraphQLOperations.GetCart,
                            source: source,
                        }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.data.cart];
                }
            });
        });
    };
    /*istanbul ignore next */
    CartApi.prototype.fetchCartLegacyOrCheckoutPlatform = function(_a, source) {
        var cartId = _a.cartId,
            _b = _a.locale,
            locale = _b === void 0 ? 'en' : _b,
            _c = _a.withTax,
            withTax = _c === void 0 ? false : _c,
            _d = _a.withShipping,
            withShipping = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {
                                cartId: cartId,
                                locale: locale,
                                withTax: withTax,
                                withShipping: withShipping
                            },
                            query: GetLegacyCartDocument,
                            operationName: GraphQLOperations.GetLegacyCart,
                            source: source,
                        }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/ , response.data.cartService.cart];
                }
            });
        });
    };
    /*istanbul ignore next */
    CartApi.prototype.fetchCartLegacyOrCheckout = function(_a, source) {
        var checkoutId = _a.checkoutId,
            cartId = _a.cartId,
            _b = _a.locale,
            locale = _b === void 0 ? 'en' : _b,
            _c = _a.withTax,
            withTax = _c === void 0 ? false : _c,
            _d = _a.withShipping,
            withShipping = _d === void 0 ? false : _d;
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {
                                cartId: cartId,
                                checkoutId: checkoutId,
                                locale: locale,
                                withTax: withTax,
                                withShipping: withShipping
                            },
                            query: GetLegacyCartOrCheckoutDocument,
                            operationName: GraphQLOperations.GetLegacyCartOrCheckout,
                            source: source,
                        }, RemoteSourceTypes.NodeReadWrite, true)];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/ , response.data.cartService.cart];
                }
            });
        });
    };
    CartApi.prototype.removeItemMutation = function(cartId, cartItemId) {
        return __awaiter(this, void 0, void 0, function() {
            var params;
            return __generator(this, function(_a) {
                params = {
                    cartId: cartId,
                    cartItemId: cartItemId
                };
                return [2 /*return*/ , this.mutate({
                    variables: {
                        params: params
                    },
                    query: removeCartItemMutationQuery,
                    operationName: GraphQLOperations.RemoveItem,
                })];
            });
        });
    };
    CartApi.prototype.removeItem = function(_a) {
        var cartId = _a.cartId,
            cartItemId = _a.cartItemId;
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.removeItemMutation(cartId, cartItemId)];
                    case 1:
                        cart = (_b.sent()).cart.removeItem.cart;
                        return [2 /*return*/ , graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.updateItemQuantityMutation = function(params) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.mutate({
                    variables: {
                        params: params
                    },
                    query: updateCartItemQuantityQuery,
                    operationName: GraphQLOperations.UpdateItemQuantity,
                })];
            });
        });
    };
    CartApi.prototype.updateItemQuantity = function(_a) {
        var cartId = _a.cartId,
            cartItemId = _a.cartItemId,
            quantity = _a.quantity;
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        if (!Number.isInteger(quantity) || quantity < 1) {
                            throw Error('Invalid quantity (should be rational and greater than 0)');
                        }
                        return [4 /*yield*/ , this.updateItemQuantityMutation({
                            cartId: cartId,
                            cartItemId: cartItemId,
                            quantity: quantity,
                        })];
                    case 1:
                        cart = (_b.sent()).cart.updateItemQuantity.cart;
                        return [2 /*return*/ , graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.updateBuyerNoteMutation = function(cartId, buyerNote) {
        if (buyerNote === void 0) {
            buyerNote = '';
        }
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.mutate({
                    variables: {
                        params: {
                            cartId: cartId,
                            buyerNote: buyerNote
                        }
                    },
                    query: updateBuyerNoteMutation,
                    operationName: GraphQLOperations.UpdateBuyerNote,
                })];
            });
        });
    };
    CartApi.prototype.updateBuyerNote = function(data, _a, withBi) {
        var cart = _a.cart;
        if (withBi === void 0) {
            withBi = true;
        }
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.updateBuyerNoteMutation(cart.cartId, data.content)];
                    case 1:
                        _b.sent();
                        if (withBi) {
                            this.biService.updateBuyerNote(cart, !!data.content);
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartApi.prototype.setDestinationForEstimation = function(data, cartId) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.mutate({
                            variables: {
                                params: {
                                    cartId: cartId,
                                    address: data.destination
                                }
                            },
                            query: setDestinationForEstimation,
                            operationName: GraphQLOperations.SetDestinationForEstimation,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartApi.prototype.setShippingOption = function(cartId, selectedShippingOption) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.mutate({
                            variables: {
                                params: {
                                    cartId: cartId,
                                    selectedShippingOption: selectedShippingOption
                                }
                            },
                            query: setCartSelectedShippingOption,
                            operationName: GraphQLOperations.SetCartShippingOptionNew,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    CartApi.prototype.setCouponMutation = function(cartId, code, userIdentifier) {
        return __awaiter(this, void 0, void 0, function() {
            var params, cart, maybeErrors;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            cartId: cartId,
                            code: code,
                            userIdentifier: userIdentifier
                        };
                        return [4 /*yield*/ , this.mutate({
                            variables: {
                                params: params
                            },
                            query: setCouponMutation,
                            operationName: GraphQLOperations.SetCoupon,
                        })];
                    case 1:
                        cart = (_a.sent()).cart;
                        maybeErrors = cart.setCoupon.errors;
                        if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
                            // eslint-disable-next-line @typescript-eslint/no-throw-literal
                            throw {
                                success: false,
                                errors: maybeErrors
                            };
                        }
                        return [2 /*return*/ , cart.setCoupon.cart];
                }
            });
        });
    };
    CartApi.prototype.applyCoupon = function(cartId, code, userIdentifier) {
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.setCouponMutation(cartId, code, userIdentifier)];
                    case 1:
                        cart = _a.sent();
                        return [2 /*return*/ , graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.removeCoupon = function(_a) {
        var cartId = _a.cartId,
            couponId = _a.couponId;
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.mutate({
                            variables: {
                                params: {
                                    cartId: cartId,
                                    couponId: couponId
                                }
                            },
                            query: removeCouponMutation,
                            operationName: GraphQLOperations.RemoveCoupon,
                        })];
                    case 1:
                        cart = (_b.sent()).cart.removeCoupon.cart;
                        return [2 /*return*/ , graphqlCartToCartSummary(cart)];
                }
            });
        });
    };
    CartApi.prototype.deleteCart = function(data, onDelete) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.commandPost(RestCommands.CartDelete, data)];
                    case 1:
                        _a.sent();
                        void onDelete(data);
                        return [2 /*return*/ ];
                }
            });
        });
    };
    return CartApi;
}(BaseApi));
export {
    CartApi
};
//# sourceMappingURL=CartApi.js.map