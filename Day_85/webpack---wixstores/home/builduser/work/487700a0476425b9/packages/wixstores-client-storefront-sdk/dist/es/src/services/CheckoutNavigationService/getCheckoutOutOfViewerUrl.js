export var getCheckoutOutOfViewerUrl = function(queryParams) {
    var url = "https://www.cartscheckout.com/storefront/checkout?storeId=" + queryParams.storeId + "&payment=" + queryParams.payment + "&forceLocale=" + queryParams.locale + "&isPickupFlow=" + queryParams.isPickUpFlow + "&origin=" + queryParams.origin + "&originType=" + queryParams.originType + "&instance=" + queryParams.instance + "&isPrimaryLanguage=" + queryParams.isPrimaryLanguage + "&deviceType=" + queryParams.deviceType + "&a11y=" + queryParams.isA11y;
    if (queryParams.cartId) {
        url += "&cartId=" + queryParams.cartId;
    }
    if (queryParams.country) {
        url += "&lang=" + queryParams.lang + "&dateNumberFormat=" + queryParams.country;
    }
    if (!queryParams.consentPolicy.defaultPolicy) {
        url += "&consent-policy=" + queryParams.consentPolicyHeader['consent-policy'];
    }
    if (queryParams.cashierPaymentId) {
        url += "&cashierPaymentId=" + queryParams.cashierPaymentId;
    }
    if (queryParams.checkoutId) {
        url += "&checkoutId=" + queryParams.checkoutId;
    }
    if (queryParams.continueShoppingUrl) {
        url += "&continueShoppingUrl=" + queryParams.continueShoppingUrl;
    }
    if (queryParams.commonConfig) {
        url += "&commonConfig=" + JSON.stringify(queryParams.commonConfig);
    }
    return url;
};
//# sourceMappingURL=getCheckoutOutOfViewerUrl.js.map