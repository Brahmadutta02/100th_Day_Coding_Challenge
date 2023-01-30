import {
    __read
} from "tslib";
export function compact(obj) {
    return Object.entries(obj).reduce(function(acc, _a) {
        var _b = __read(_a, 2),
            k = _b[0],
            v = _b[1];
        if (v) {
            acc[k] = v;
        }
        return acc;
    }, {});
}
//# sourceMappingURL=compact.js.map