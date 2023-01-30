import {
    ProductActions
} from '../../../actions/ProductActions/ProductActions';
export var toProductPage = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(args) {
        return new ProductActions({
            siteStore: context.siteStore,
            origin: origin
        }).navigateToProductPage(args);
    };
};
//# sourceMappingURL=toProductPage.js.map