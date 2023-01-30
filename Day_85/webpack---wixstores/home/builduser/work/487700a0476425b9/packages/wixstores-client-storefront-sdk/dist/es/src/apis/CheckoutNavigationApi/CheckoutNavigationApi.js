import {
    __extends
} from "tslib";
import {
    BaseApi
} from '../BaseApi';
import {
    LOST_BUSINESS_NOTIFIER_NOTIFY_PATH
} from './constants';
var CheckoutNavigationApi = /** @class */ (function(_super) {
    __extends(CheckoutNavigationApi, _super);

    function CheckoutNavigationApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckoutNavigationApi.prototype.notifyLostBusinessNotifier = function() {
        return this.post(LOST_BUSINESS_NOTIFIER_NOTIFY_PATH, {});
    };
    return CheckoutNavigationApi;
}(BaseApi));
export {
    CheckoutNavigationApi
};
//# sourceMappingURL=CheckoutNavigationApi.js.map