import {
    __assign
} from "tslib";
export var removeUndefinedKeys = function(object) {
    return Object.keys(object).reduce(function(acc, x) {
        var _a;
        return __assign(__assign({}, acc), (object[x] === undefined ? {} : (_a = {}, _a[x] = object[x], _a)));
    }, {});
};
//# sourceMappingURL=removeUndefinedKeys.js.map