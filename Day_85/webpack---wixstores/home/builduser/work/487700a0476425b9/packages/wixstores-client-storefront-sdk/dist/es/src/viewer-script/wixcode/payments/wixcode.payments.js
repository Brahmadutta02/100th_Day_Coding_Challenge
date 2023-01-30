import {
    getPaymentMethodsBannerProps
} from './getPaymentMethodsBannerProps';
export function createPaymentsExports(_a) {
    var context = _a.context;
    return {
        getPaymentMethodsBannerProps: function(productInfo) {
            return getPaymentMethodsBannerProps(context.siteStore, productInfo);
        },
    };
}
//# sourceMappingURL=wixcode.payments.js.map