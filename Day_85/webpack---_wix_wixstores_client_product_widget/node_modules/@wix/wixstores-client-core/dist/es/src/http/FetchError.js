import {
    __extends
} from "tslib";
var FetchError = /** @class */ (function(_super) {
    __extends(FetchError, _super);

    function FetchError(message, data) {
        var _this = _super.call(this, message) || this;
        _this.data = data;
        _this.name = 'FetchError';
        return _this;
    }
    return FetchError;
}(Error));
export {
    FetchError
};
//# sourceMappingURL=FetchError.js.map