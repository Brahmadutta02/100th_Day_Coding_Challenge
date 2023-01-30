import {
    __read,
    __spread
} from "tslib";
import {
    ONE_HUNDRED_THOUSAND
} from '../../constants';
export var getCatalogAppIds = function(cart) {
    return getMappedUniqueList(cart.items, function(_a) {
        var catalogAppId = _a.catalogAppId;
        return catalogAppId;
    });
};
export var getItemTypes = function(cart) {
    return getMappedUniqueList(cart.items, function(_a) {
        var productType = _a.productType;
        return productType;
    });
};
export var getItemsCount = function(cart) {
    var _a, _b;
    /* istanbul ignore next */
    return (_b = (_a = cart === null || cart === void 0 ? void 0 : cart.items) === null || _a === void 0 ? void 0 : _a.reduce(function(count, item) {
        return count + item.quantity;
    }, 0)) !== null && _b !== void 0 ? _b : 0;
};

function getMappedUniqueList(arr, mapper) {
    return getUniques((arr !== null && arr !== void 0 ? arr : []).map(mapper).filter(isDefined)).toString();
}
var getUniques = function(arr) {
    return __spread(new Set(__spread(arr)));
};
var isDefined = function(obj) {
    return !!obj;
};
export var getAdditionalFeesPrice = function(cart) {
    var _a, _b;
    /* istanbul ignore next */
    return ((_b = (_a = cart === null || cart === void 0 ? void 0 : cart.totals) === null || _a === void 0 ? void 0 : _a.additionalFeesTotal) !== null && _b !== void 0 ? _b : 0) * ONE_HUNDRED_THOUSAND;
};
export var getNumberOfAdditionalFees = function(cart) {
    var _a, _b;
    /* istanbul ignore next */
    return (_b = (_a = cart === null || cart === void 0 ? void 0 : cart.additionalFees) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
};
//# sourceMappingURL=bi.utils.js.map