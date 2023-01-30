import {
    NavigationService
} from '../../../services/ProductNavigation/NavigationService';
export var getReferringPageId = function(_a) {
    var context = _a.context;
    return function() {
        var navigationService = new NavigationService({
            siteStore: context.siteStore
        });
        var pageId = navigationService.navigationContext.pageId;
        return Promise.resolve(pageId);
    };
};
//# sourceMappingURL=getReferringPageId.js.map