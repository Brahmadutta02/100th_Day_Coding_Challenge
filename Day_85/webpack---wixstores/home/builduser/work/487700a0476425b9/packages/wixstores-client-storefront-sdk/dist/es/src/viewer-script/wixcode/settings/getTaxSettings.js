export var getTaxSettings = function(siteStore) {
    return {
        localeTaxName: siteStore.taxName,
        includeTaxOnProduct: siteStore.priceSettings.taxOnProduct,
        showTaxDisclaimer: siteStore.priceSettings.showTaxDisclaimer,
    };
};
//# sourceMappingURL=getTaxSettings.js.map