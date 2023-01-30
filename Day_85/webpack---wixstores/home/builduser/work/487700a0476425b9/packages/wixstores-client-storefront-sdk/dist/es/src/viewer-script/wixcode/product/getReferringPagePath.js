import {
    NavigationService
} from '../../../services/ProductNavigation/NavigationService';
export var getReferringPagePath = function(_a) {
    var context = _a.context;
    return function() {
        var navigationService = new NavigationService({
            siteStore: context.siteStore
        });
        var pagePath = navigationService.navigationContext.pagePath;
        return Promise.resolve(pagePath);
    };
};
//# sourceMappingURL=getReferringPagePath.js.map