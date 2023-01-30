import {
    PubSubEvents
} from '@wix/wixstores-client-core';
export var publishRelatedProductsEvent = function(_a) {
    var context = _a.context;
    return function(productIds) {
        return context.siteStore.pubSub.publish(PubSubEvents.RELATED_PRODUCTS, productIds, true);
    };
};
//# sourceMappingURL=publishRelatedProductsEvent.js.map