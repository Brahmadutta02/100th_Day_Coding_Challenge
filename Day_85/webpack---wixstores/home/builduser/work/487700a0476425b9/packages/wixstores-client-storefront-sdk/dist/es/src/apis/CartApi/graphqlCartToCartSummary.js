import {
    __assign
} from "tslib";
import {
    newCartToOldCartStructure
} from '@wix/wixstores-client-core';
export var graphqlCartToCartSummary = function(cart) {
    return __assign(__assign({}, newCartToOldCartStructure(cart)), {
        __typename: 'CartSummary'
    });
};
//# sourceMappingURL=graphqlCartToCartSummary.js.map