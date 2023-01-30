import {
    PageMap
} from '@wix/wixstores-client-core';
import {
    SPECS
} from '../../constants';
var QuickViewActions = /** @class */ (function() {
    function QuickViewActions(siteStore) {
        this.siteStore = siteStore;
    }
    QuickViewActions.prototype.getQuickViewUrl = function(_a) {
        var externalId = _a.externalId,
            instance = _a.instance,
            origin = _a.origin,
            urlPart = _a.urlPart,
            selectionIds = _a.selectionIds,
            quantity = _a.quantity;
        var url = "https://ecom.wixapps.net/storefront/product/" + urlPart;
        var params = {
            layout: 'quickview',
            origin: origin,
            instance: instance,
        };
        if (externalId) {
            params.externalId = externalId;
        }
        if (selectionIds === null || selectionIds === void 0 ? void 0 : selectionIds.length) {
            params.selectionIds = encodeURIComponent(selectionIds.join(','));
        }
        if (quantity && quantity > 1) {
            params.quantity = quantity.toString();
        }
        var paramsSerialized = Object.keys(params)
            // @ts-expect-error
            .map(function(key) {
                return key + "=" + params[key];
            })
            .join('&');
        return url + "?" + paramsSerialized;
    };
    QuickViewActions.prototype.openQuickViewLightbox = function(urlPart) {
        return this.siteStore.windowApis.openLightbox('Quick View', {
            productSlug: urlPart
        });
    };
    QuickViewActions.prototype.quickViewProduct = function(_a) {
        var origin = _a.origin,
            urlPart = _a.urlPart,
            compId = _a.compId,
            externalId = _a.externalId,
            selectionIds = _a.selectionIds,
            quantity = _a.quantity,
            title = _a.title;
        if (this.siteStore.isMobile()) {
            return this.siteStore.navigate({
                sectionId: PageMap.PRODUCT,
                state: urlPart,
                queryParams: undefined,
            }, true);
        }
        var quickViewUrl = this.getQuickViewUrl({
            // @ts-expect-error
            externalId: externalId,
            instance: this.siteStore.instanceManager.getInstance(),
            origin: origin,
            urlPart: urlPart,
            selectionIds: selectionIds,
            quantity: quantity,
        });
        return this.siteStore.experiments.enabled(SPECS.USE_LIGHTBOXES) ?
            this.openQuickViewLightbox(urlPart) :
            this.siteStore.windowApis.openModal(quickViewUrl, {
                title: title,
                width: 940,
                height: 660,
                theme: 'BARE',
            }, compId);
    };
    return QuickViewActions;
}());
export {
    QuickViewActions
};
//# sourceMappingURL=QuickViewActions.js.map