import {
    __extends
} from "tslib";
import {
    BaseActions
} from '../BaseActions';
var TinyCartActions = /** @class */ (function(_super) {
    __extends(TinyCartActions, _super);

    function TinyCartActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TinyCartActions.prototype.showTinyCart = function() {
        this.siteStore.pubSubManager.publish('Tinycart.Show', null);
    };
    TinyCartActions.prototype.hideTinyCart = function() {
        this.siteStore.pubSubManager.publish('Tinycart.Hide', null);
    };
    return TinyCartActions;
}(BaseActions));
export {
    TinyCartActions
};
//# sourceMappingURL=TinyCartActions.js.map