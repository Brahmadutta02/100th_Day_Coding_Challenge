var _a;
import {
    StoresWidgetID
} from '@wix/wixstores-client-core';
export var ADD_TO_CART_DSN = 'https://8c4075d5481d476e945486754f783364@sentry.io/1865790';
export var CART_DSN = 'https://7a9383877d1648169973b9d6339b753b@o37417.ingest.sentry.io/5552111';
export var CART_ICON_DSN = 'https://31e500c94d2042ff81a38a0e4a2873b7@sentry.io/1252955';
export var CATEGORY_PAGE_DSN = 'https://6b91522f8e31474a91d982a1066e7f8c@o37417.ingest.sentry.io/4504173802422272';
export var GALLERY_PAGE_DSN = 'https://337a342c302c4c0e8c26e425e74da4c1@sentry.io/1363752';
export var PRODUCT_PAGE_DSN = 'https://5605bf8f38c54260af44e1d7bc2450bd@sentry.io/1362236';
export var PRODUCT_WIDGET_DSN = 'https://04ac210d4a934172b7aead660647e5a0@sentry.io/1411933';
export var SLIDER_GALLERY_DSN = 'https://c4847d204c6e4c1aa7f9ff220369cee2@sentry.io/1388877';
export var WISHLIST_DSN = 'https://44f49ac405574dfb9df693981a668c09@sentry.io/1872502';
export var CHECKOUT_DSN = 'https://4dbead23671d4e308339cb3e26e20bb7@sentry.io/283703';
export var THANK_YOU_PAGE_DSN = 'https://5ce86095794d4b0dbded2351db71baf8@o37417.ingest.sentry.io/5792095';
export var ECOM_PLATFORM_CHECKOUT_DSN = 'https://ad35e6e606da4e6ab90753238365334d@sentry.wixpress.com/3551';
export var sentryConfPerController = (_a = {},
    _a[StoresWidgetID.ADD_TO_CART] = {
        dsn: ADD_TO_CART_DSN,
        baseUrlsKey: 'addToCartBaseUrl'
    },
    _a[StoresWidgetID.CART] = {
        dsn: CART_DSN,
        baseUrlsKey: 'cartBaseUrl'
    },
    _a[StoresWidgetID.CART_ICON] = {
        dsn: CART_ICON_DSN,
        baseUrlsKey: 'cartIconBaseUrl'
    },
    _a[StoresWidgetID.CATEGORY_PAGE] = {
        dsn: CATEGORY_PAGE_DSN,
        baseUrlsKey: 'categoryBaseUrl'
    },
    _a[StoresWidgetID.GALLERY_PAGE] = {
        dsn: GALLERY_PAGE_DSN,
        baseUrlsKey: 'galleryBaseUrl'
    },
    _a[StoresWidgetID.GRID_GALLERY] = {
        dsn: GALLERY_PAGE_DSN,
        baseUrlsKey: 'galleryBaseUrl'
    },
    _a[StoresWidgetID.PRODUCT_PAGE] = {
        dsn: PRODUCT_PAGE_DSN,
        baseUrlsKey: 'productPageBaseUrl'
    },
    _a[StoresWidgetID.PRODUCT_WIDGET] = {
        dsn: PRODUCT_WIDGET_DSN,
        baseUrlsKey: 'productWidgetBaseUrl'
    },
    _a[StoresWidgetID.SLIDER_GALLERY] = {
        dsn: SLIDER_GALLERY_DSN,
        baseUrlsKey: 'galleryBaseUrl'
    },
    _a[StoresWidgetID.THANK_YOU_PAGE] = {
        dsn: THANK_YOU_PAGE_DSN,
        baseUrlsKey: 'thankYouPageBaseUrl'
    },
    _a[StoresWidgetID.WISHLIST_PAGE] = {
        dsn: WISHLIST_DSN,
        baseUrlsKey: 'wishlistBaseUrl'
    },
    _a[StoresWidgetID.CHECKOUT] = {
        dsn: CHECKOUT_DSN,
        baseUrlsKey: 'checkoutBaseUrl'
    },
    _a[StoresWidgetID.ECOM_PLATFORM_CHECKOUT] = {
        dsn: ECOM_PLATFORM_CHECKOUT_DSN,
        baseUrlsKey: 'ecomPlatformCheckoutBaseUrl',
    },
    _a);
//# sourceMappingURL=sentryConf.js.map