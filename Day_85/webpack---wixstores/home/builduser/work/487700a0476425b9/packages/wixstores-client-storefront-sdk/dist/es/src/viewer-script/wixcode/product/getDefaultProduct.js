import {
    ProductActions
} from '../../../actions/ProductActions/ProductActions';
export var getDefaultProduct = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function() {
        return new ProductActions({
            siteStore: context.siteStore,
            origin: origin
        }).fetchDefaultProduct();
    };
};
//# sourceMappingURL=getDefaultProduct.js.map