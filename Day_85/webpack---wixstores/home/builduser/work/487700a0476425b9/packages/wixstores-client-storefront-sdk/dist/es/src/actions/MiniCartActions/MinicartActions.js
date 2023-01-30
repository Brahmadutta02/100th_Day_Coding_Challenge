import {
    __extends
} from "tslib";
import {
    BaseActions
} from '../BaseActions';
var MinicartActions = /** @class */ (function(_super) {
    __extends(MinicartActions, _super);

    function MinicartActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MinicartActions.prototype.showMinicart = function() {
        this.siteStore.pubSubManager.publish('Minicart.Show', null);
    };
    MinicartActions.prototype.hideMinicart = function() {
        this.siteStore.pubSubManager.publish('Minicart.Hide', null);
    };
    return MinicartActions;
}(BaseActions));
export {
    MinicartActions
};
//# sourceMappingURL=MinicartActions.js.map