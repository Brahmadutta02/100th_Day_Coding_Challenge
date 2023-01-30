import {
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    BaseApi
} from '../BaseApi';
import {
    GraphQLOperations,
    RemoteSourceTypes
} from '../constants';
import {
    GetBackInStockSettingsDocument,
} from '../../graphql/__generated__/getBackInStockSettings';
var BackInStockApi = /** @class */ (function(_super) {
    __extends(BackInStockApi, _super);

    function BackInStockApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackInStockApi.prototype.getBackInStockSettings = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            query: GetBackInStockSettingsDocument,
                            operationName: GraphQLOperations.GetBackInStockSettings,
                            variables: null,
                        }, RemoteSourceTypes.NodeReadWrite)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.data];
                }
            });
        });
    };
    return BackInStockApi;
}(BaseApi));
export {
    BackInStockApi
};
//# sourceMappingURL=BackInStockApi.js.map