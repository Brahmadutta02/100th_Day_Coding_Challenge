import {
    __assign,
    __awaiter,
    __generator,
    __read
} from "tslib";
import {
    NavigationService
} from '../../../services/ProductNavigation/NavigationService';
export var getContextualProducts = function(_a) {
    var context = _a.context,
        getAbsoluteProductUrl = _a.getAbsoluteProductUrl,
        getRelativeProductUrl = _a.getRelativeProductUrl;
    return function() {
        return __awaiter(void 0, void 0, void 0, function() {
            var navigationService;
            return __generator(this, function(_a) {
                navigationService = new NavigationService({
                    siteStore: context.siteStore
                });
                return [2 /*return*/ , Promise.all(navigationService.getContextualProductDescriptors().map(function(productDescriptor) {
                    return __awaiter(void 0, void 0, void 0, function() {
                        var _a, relativeUrl, absoluteUrl;
                        return __generator(this, function(_b) {
                            switch (_b.label) {
                                case 0:
                                    return [4 /*yield*/ , Promise.all([
                                        getRelativeProductUrl(productDescriptor),
                                        getAbsoluteProductUrl(productDescriptor),
                                    ])];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), relativeUrl = _a[0], absoluteUrl = _a[1];
                                    return [2 /*return*/ , __assign(__assign({}, productDescriptor), {
                                        relativeUrl: relativeUrl,
                                        absoluteUrl: absoluteUrl
                                    })];
                            }
                        });
                    });
                }))];
            });
        });
    };
};
//# sourceMappingURL=getContextualProducts.js.map