export var APP_DEFINITION_ID = '1380b703-ce81-ff05-f115-39571d94dfcd';
export var STORES_APP_DEF_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';
export var ADDRESSES_APP_DEFINITION_ID = '1505b775-e885-eb1b-b665-1e485d9bf90e';
export var MY_WALLET_APP_DEFINITION_ID = '4aebd0cb-fbdb-4da7-b5d1-d05660a30172';
export var PAID_PLANS_APP_DEFINITION_ID = '1522827f-c56c-a5c9-2ac9-00f9e6ae12d3';
export var SUBSCRIPTION_APP_DEFINITION_ID = '8725b255-2aa2-4a53-b76d-7d3c363aaeea';
export var BACK_IN_STOCK_APP_DEFINITION_ID = '16be6c71-d061-4f56-8cda-c6aa911d1832';
export var STORES_PREMIUM = 'stores_basic_premium';
export var StoresWidgetID;
(function(StoresWidgetID) {
    StoresWidgetID["CART_ICON"] = "1380bbc4-1485-9d44-4616-92e36b1ead6b";
    StoresWidgetID["PRODUCT_PAGE"] = "13a94f09-2766-3c40-4a32-8edb5acdd8bc";
    StoresWidgetID["PRODUCT_WIDGET"] = "13ec3e79-e668-cc0c-2d48-e99d53a213dd";
    StoresWidgetID["GALLERY_PAGE"] = "1380bba0-253e-a800-a235-88821cf3f8a4";
    StoresWidgetID["CATEGORY_PAGE"] = "bda15dc1-816d-4ff3-8dcb-1172d5343cce";
    StoresWidgetID["GRID_GALLERY"] = "13afb094-84f9-739f-44fd-78d036adb028";
    StoresWidgetID["SLIDER_GALLERY"] = "139a41fd-0b1d-975f-6f67-e8cbdf8ccc82";
    StoresWidgetID["THANK_YOU_PAGE"] = "1380bbb4-8df0-fd38-a235-88821cf3f8a4";
    StoresWidgetID["ADD_TO_CART"] = "14666402-0bc7-b763-e875-e99840d131bd";
    StoresWidgetID["WISHLIST_PAGE"] = "a63a5215-8aa6-42af-96b1-583bfd74cff5";
    StoresWidgetID["CART"] = "1380bbab-4da3-36b0-efb4-2e0599971d14";
    StoresWidgetID["CHECKOUT"] = "14fd5970-8072-c276-1246-058b79e70c1a";
    StoresWidgetID["MY_ORDERS"] = "14e121c8-00a3-f7cc-6156-2c82a2ba8fcb";
    StoresWidgetID["ECOM_PLATFORM_CHECKOUT"] = "14fd5970-8072-c276-1246-058b79e70c1a";
})(StoresWidgetID || (StoresWidgetID = {}));
export var Topology;
(function(Topology) {
    Topology["CART_COMMANDS_URL"] = "/_api/wix-ecommerce-renderer-web/store-front/cart/{commandName}";
    Topology["NODE_GRAPHQL_URL"] = "_api/wixstores-graphql-server/graphql";
    Topology["READ_WRITE_GRAPHQL_URL"] = "_api/wix-ecommerce-graphql-web/api";
    Topology["STOREFRONT_GRAPHQL_URL"] = "_api/wix-ecommerce-storefront-web/api";
    Topology["WISHLIST_BASE_URL"] = "/_api/wishlist-server";
})(Topology || (Topology = {}));
export var AddToCartActionOption;
(function(AddToCartActionOption) {
    AddToCartActionOption[AddToCartActionOption["TINY_CART"] = 0] = "TINY_CART";
    AddToCartActionOption[AddToCartActionOption["MINI_CART"] = 1] = "MINI_CART";
    AddToCartActionOption[AddToCartActionOption["CART"] = 2] = "CART";
    AddToCartActionOption[AddToCartActionOption["NONE"] = 3] = "NONE";
})(AddToCartActionOption || (AddToCartActionOption = {}));
export var CheckoutButtonsPosition;
(function(CheckoutButtonsPosition) {
    CheckoutButtonsPosition["ABOVE_AND_BELOW_CART"] = "0";
    CheckoutButtonsPosition["ONLY_BELOW_CART"] = "1";
})(CheckoutButtonsPosition || (CheckoutButtonsPosition = {}));
export var ActionStatus;
(function(ActionStatus) {
    ActionStatus[ActionStatus["IDLE"] = 0] = "IDLE";
    ActionStatus[ActionStatus["SUCCESSFUL"] = 1] = "SUCCESSFUL";
    ActionStatus[ActionStatus["FAILED"] = 2] = "FAILED";
})(ActionStatus || (ActionStatus = {}));
export var PageMap;
(function(PageMap) {
    PageMap["CART"] = "shopping_cart";
    PageMap["CHECKOUT"] = "checkout";
    PageMap["GALLERY"] = "product_gallery";
    PageMap["CATEGORY"] = "Category Page";
    PageMap["THANKYOU"] = "thank_you_page";
    PageMap["PRODUCT"] = "product_page";
    PageMap["ORDER_HISTORY"] = "order_history";
    PageMap["WISHLIST"] = "wishlist";
})(PageMap || (PageMap = {}));
export var CacheKey;
(function(CacheKey) {
    CacheKey["GET_CONFIG"] = "getConfig";
    CacheKey["MULTI_LANG"] = "multiLang";
    CacheKey["MINICART_OPEN"] = "miniCartOpen";
})(CacheKey || (CacheKey = {}));
export var PubSubEvents;
(function(PubSubEvents) {
    PubSubEvents["RELATED_PRODUCTS"] = "relatedProductIds";
})(PubSubEvents || (PubSubEvents = {}));
export var BiButtonActionType;
(function(BiButtonActionType) {
    BiButtonActionType["AddToCart"] = "add to cart";
    BiButtonActionType["BuyNow"] = "buy now";
    BiButtonActionType["Subscribe"] = "subscribe";
    BiButtonActionType["PreOrder"] = "pre order";
    BiButtonActionType["PreOrderNow"] = "pre order now";
})(BiButtonActionType || (BiButtonActionType = {}));
export var SPECS;
(function(SPECS) {
    SPECS["USE_LIGHTBOXES"] = "specs.stores.UseLightboxes";
    SPECS["USE_LATEST_SUBDIVISIONS"] = "specs.stores.UseLatestSubdivisionsClient";
})(SPECS || (SPECS = {}));
export var CURRENCY_HEADER_NAME = 'x-wix-currency';
export var MULTI_LANG_HEADER_NAME = 'x-wix-linguist';
export var CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
export var VIEWER_SCRIPT_DSN = 'https://8bc29fb6cd064a49a9945743de020bf2@sentry.io/1186457';
export var STORAGE_PAGINATION_KEY = "wixstores-pagination-map";
export var APP_SETTINGS_CDN = 'https://settings.parastorage.com';
export var MINICART_POPUP_URL = 'https://ecom.wixapps.net/storefront/cartwidgetPopup';
export var STORES_FQDN;
(function(STORES_FQDN) {
    STORES_FQDN["PRODUCT_PAGE"] = "wix.stores.sub_pages.product";
})(STORES_FQDN || (STORES_FQDN = {}));
export var ServerTransactionStatus;
(function(ServerTransactionStatus) {
    ServerTransactionStatus["Undefined"] = "UNDEFINED";
    ServerTransactionStatus["Dispute"] = "DISPUTE";
    ServerTransactionStatus["CompletedFundsHeld"] = "COMPLETED_FUNDS_HELD";
    ServerTransactionStatus["Initialization"] = "INITIALIZATION";
    ServerTransactionStatus["Initialized"] = "INITIALIZED";
    ServerTransactionStatus["Pending"] = "PENDING";
    ServerTransactionStatus["InProcess"] = "IN_PROCESS";
    ServerTransactionStatus["PartialRefund"] = "PARTIAL_REFUND";
    ServerTransactionStatus["Approved"] = "APPROVED";
    ServerTransactionStatus["PendingMerchant"] = "PENDING_MERCHANT";
    ServerTransactionStatus["PendingBuyer"] = "PENDING_BUYER";
    ServerTransactionStatus["ChargeBack"] = "CHARGE_BACK";
    ServerTransactionStatus["Declined"] = "DECLINED";
    ServerTransactionStatus["Expired"] = "EXPIRED";
    ServerTransactionStatus["Failed"] = "FAILED";
    ServerTransactionStatus["BuyerCanceled"] = "BUYER_CANCELED";
    ServerTransactionStatus["TpaCanceled"] = "TPA_CANCELED";
    ServerTransactionStatus["Void"] = "VOID";
    ServerTransactionStatus["Timeout"] = "TIMEOUT";
    ServerTransactionStatus["Refund"] = "REFUND";
    ServerTransactionStatus["Offline"] = "OFFLINE";
})(ServerTransactionStatus || (ServerTransactionStatus = {}));
export var RouterPrefix;
(function(RouterPrefix) {
    RouterPrefix["CATEGORY"] = "category";
})(RouterPrefix || (RouterPrefix = {}));
//# sourceMappingURL=constants.js.map