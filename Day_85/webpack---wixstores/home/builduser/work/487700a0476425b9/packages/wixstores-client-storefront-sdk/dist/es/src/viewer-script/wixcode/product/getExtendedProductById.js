import {
    ProductActions
} from '../../../actions/ProductActions/ProductActions';
export var getExtendedProductById = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(id) {
        return new ProductActions({
            siteStore: context.siteStore,
            origin: origin
        }).fetchExtendedProductById(id);
    };
};
//# sourceMappingURL=getExtendedProductById.js.map