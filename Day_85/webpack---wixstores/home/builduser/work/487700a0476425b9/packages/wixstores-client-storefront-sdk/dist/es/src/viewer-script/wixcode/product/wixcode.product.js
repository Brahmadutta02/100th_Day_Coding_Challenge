import {
    getDefaultProduct
} from './getDefaultProduct';
import {
    openQuickView
} from './openQuickView';
import {
    getExtendedProductBySlug
} from './getExtendedProductBySlug';
import {
    getProductUrl
} from './getProductUrl';
import {
    getContextualProducts
} from './getContextualProducts';
import {
    getExtendedProductById
} from './getExtendedProductById';
import {
    getReferringPageId
} from './getReferringPageId';
import {
    publishRelatedProductsEvent
} from './publishRelatedProductsEvent';
import {
    getReferringPagePath
} from './getReferringPagePath';
export function createProductExports(_a) {
    var context = _a.context,
        origin = _a.origin;
    var getAbsoluteProductUrlFn = getProductUrl({
        context: context,
        origin: origin,
        isRelative: false
    });
    var getRelativeProductUrlFn = getProductUrl({
        context: context,
        origin: origin,
        isRelative: true
    });
    return {
        openQuickView: openQuickView({
            context: context,
            origin: origin
        }),
        getDefaultProduct: getDefaultProduct({
            context: context,
            origin: origin
        }),
        getExtendedProductBySlug: getExtendedProductBySlug({
            context: context,
            origin: origin
        }),
        getExtendedProductById: getExtendedProductById({
            context: context,
            origin: origin
        }),
        getAbsoluteProductUrl: getAbsoluteProductUrlFn,
        getRelativeProductUrl: getRelativeProductUrlFn,
        getContextualProducts: getContextualProducts({
            context: context,
            getAbsoluteProductUrl: getAbsoluteProductUrlFn,
            getRelativeProductUrl: getRelativeProductUrlFn,
        }),
        getReferringPageId: getReferringPageId({
            context: context
        }),
        getReferringPagePath: getReferringPagePath({
            context: context
        }),
        publishRelatedProducts: publishRelatedProductsEvent({
            context: context
        }),
    };
}
//# sourceMappingURL=wixcode.product.js.map