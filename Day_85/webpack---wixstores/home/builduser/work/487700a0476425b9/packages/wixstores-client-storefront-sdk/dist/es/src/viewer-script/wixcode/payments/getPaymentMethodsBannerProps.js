import {
    APP_DEFINITION_ID
} from '@wix/wixstores-client-core';
import {
    Theme
} from '@wix/payment-methods-banner/dist/src/types/Theme';
export var getPaymentMethodsBannerProps = function(siteStore, options) {
    return {
        meta: {
            appDefId: APP_DEFINITION_ID,
            appInstanceId: siteStore.storeId,
            appInstance: siteStore.instanceManager.getInstance(),
            productId: options.productId,
            msid: siteStore.storeId,
            host: siteStore.location.baseUrl,
            visitorId: siteStore.uuid,
        },
        amount: options.amount,
        currency: siteStore.getCurrentCurrency(),
        demoMode: siteStore.isEditorMode() || siteStore.isPreviewMode(),
        deviceType: siteStore.isMobile() ? 'mobile' : 'desktop',
        isSSR: siteStore.isSSR(),
        locale: siteStore.locale,
        theme: options.theme ? options.theme : Theme.Light,
        onFullLoad: options.onFullLoad,
        onEmpty: options.onEmpty,
    };
};
//# sourceMappingURL=getPaymentMethodsBannerProps.js.map