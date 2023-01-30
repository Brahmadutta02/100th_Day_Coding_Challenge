export var BI_APP_NAME = 'Stores';
export var RestCommands;
(function(RestCommands) {
    RestCommands["CartDelete"] = "DeleteCartCommand";
    RestCommands["CartRemoveItem"] = "RemoveCartItemCommand";
    RestCommands["CartUpdateItem"] = "UpdateCartItemCommand";
    RestCommands["CartUpdateBuyerNote"] = "UpdateBuyerNoteToCartCommand";
    RestCommands["CartApplyCoupon"] = "SetCartCouponCommand2";
    RestCommands["CartRemoveCoupon"] = "RemoveCouponFromCartCommand";
})(RestCommands || (RestCommands = {}));
export var GraphQLOperations;
(function(GraphQLOperations) {
    GraphQLOperations["GetAppSettings"] = "getAppSettings";
    GraphQLOperations["GetCartService"] = "getCartService";
    GraphQLOperations["GetCart"] = "getCart";
    GraphQLOperations["GetCartOld"] = "getCartOld";
    GraphQLOperations["GetLegacyCart"] = "getLegacyCart";
    GraphQLOperations["GetLegacyCartOrCheckout"] = "getLegacyCartOrCheckout";
    GraphQLOperations["GetCashierCheckoutData"] = "getCashierCheckoutData";
    GraphQLOperations["GetCheckout"] = "getCheckout";
    GraphQLOperations["GetDepositData"] = "getDepositData";
    GraphQLOperations["GetLocaleData"] = "getLocaleData";
    GraphQLOperations["GetAtlasAddressByZipCode"] = "getAtlasAddressByZipCode";
    GraphQLOperations["GetOrder"] = "getOrder";
    GraphQLOperations["GetOrderForTYP"] = "getOrderForTYP";
    GraphQLOperations["GetPayments"] = "getPayments";
    GraphQLOperations["GetSubscription"] = "getSubscription";
    GraphQLOperations["GetStoreMetaData"] = "getStoreMetaData";
    GraphQLOperations["GetProduct"] = "getProduct";
    GraphQLOperations["GetExtendedProductBySlug"] = "getExtendedProductBySlug";
    GraphQLOperations["GetExtendedProductById"] = "getExtendedProductById";
    GraphQLOperations["GetExtendedProductsList"] = "getExtendedProductsList";
    GraphQLOperations["GetBackInStockSettings"] = "getBackInStockSettings";
    GraphQLOperations["GetCountryCodes"] = "getCountryCodes";
    GraphQLOperations["SetAddress"] = "setAddress";
    GraphQLOperations["SetCartShippingAddressAndDestination"] = "setCartShippingAddressAndDestination";
    GraphQLOperations["SetCartBillingAddress"] = "setCartBillingAddress";
    GraphQLOperations["SetCartShippingAddressesForFastFlowEstimation"] = "setCartShippingAddressesForFastFlowEstimation";
    GraphQLOperations["SetDestinationForEstimation"] = "setDestinationForEstimation";
    GraphQLOperations["SetCartAddressesAndDestinationFromSingleAddress"] = "setCartAddressesAndDestinationFromSingleAddress";
    GraphQLOperations["SetCartShippingOption"] = "setShippingOption";
    GraphQLOperations["SetCartShippingOptionNew"] = "setCartShippingOption";
    GraphQLOperations["SubmitPayment"] = "submitPayment";
    GraphQLOperations["CreateCheckout"] = "createCheckout";
    GraphQLOperations["MarkCheckoutAsCompleted"] = "markCheckoutAsCompleted";
    GraphQLOperations["AddToCart"] = "addToCart";
    GraphQLOperations["AddCustomItemsToCart"] = "addCustomItemsToCart";
    GraphQLOperations["AddToCartWixCode"] = "addToCartWixCode";
    GraphQLOperations["SetCoupon"] = "setCoupon";
    GraphQLOperations["RemoveCoupon"] = "removeCoupon";
    GraphQLOperations["UpdateBuyerNote"] = "updateBuyerNote";
    GraphQLOperations["RemoveItem"] = "removeItem";
    GraphQLOperations["UpdateItemQuantity"] = "updateItemQuantity";
    GraphQLOperations["CreateCart"] = "createCart";
    GraphQLOperations["GetCheckoutSettings"] = "getCheckoutSettings";
})(GraphQLOperations || (GraphQLOperations = {}));
export var CartEvents;
(function(CartEvents) {
    CartEvents["Changed"] = "Cart.Changed";
    CartEvents["Cleared"] = "Cart.Cleared";
})(CartEvents || (CartEvents = {}));
export var RemoteSourceTypes;
(function(RemoteSourceTypes) {
    RemoteSourceTypes["NodeReadWrite"] = "NodeReadWrite";
    RemoteSourceTypes["NodeReadWriteForcePlatform"] = "NodeReadWriteForcePlatform";
    RemoteSourceTypes["ScalaReadOnly"] = "ScalaReadOnly";
    RemoteSourceTypes["ScalaReadWrite"] = "ScalaReadWrite";
})(RemoteSourceTypes || (RemoteSourceTypes = {}));
//# sourceMappingURL=constants.js.map