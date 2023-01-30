import {
    STORAGE_PAGINATION_KEY,
} from '@wix/wixstores-client-core';
var NavigationService = /** @class */ (function() {
    function NavigationService(_a) {
        var siteStore = _a.siteStore;
        this.siteStore = siteStore;
    }
    NavigationService.prototype.getContextualProductDescriptors = function() {
        var paginationMap = this.navigationContext.paginationMap;
        if (this.siteStore.isEditorMode() || !paginationMap.length) {
            return [];
        }
        return paginationMap.map(function(p) {
            return (typeof p !== 'string' ? p : {
                slug: p
            });
        });
    };
    Object.defineProperty(NavigationService.prototype, "navigationContext", {
        get: function() {
            var context;
            try {
                context = JSON.parse(this.siteStore.storage.local.getItem(STORAGE_PAGINATION_KEY));
            } catch (_a) {
                //
            }
            return context !== null && context !== void 0 ? context : {
                pageId: undefined,
                paginationMap: [],
                pagePath: []
            };
        },
        enumerable: false,
        configurable: true
    });
    return NavigationService;
}());
export {
    NavigationService
};
//# sourceMappingURL=NavigationService.js.map