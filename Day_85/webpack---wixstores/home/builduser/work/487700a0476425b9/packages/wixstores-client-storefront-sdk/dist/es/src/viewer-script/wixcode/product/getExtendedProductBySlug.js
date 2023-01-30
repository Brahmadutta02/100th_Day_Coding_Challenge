import {
    ProductActions
} from '../../../actions/ProductActions/ProductActions';
export var getExtendedProductBySlug = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(slug) {
        return new ProductActions({
            siteStore: context.siteStore,
            origin: origin
        }).fetchExtendedProductBySlug(slug);
    };
};
//# sourceMappingURL=getExtendedProductBySlug.js.map