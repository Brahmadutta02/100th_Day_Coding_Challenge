import {
    __assign,
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    BaseApi
} from '../BaseApi';
import {
    query as getStoreMetaData
} from '../../graphql/getStoreMetaData.graphql';
import {
    GraphQLOperations
} from '../constants';
var StoreMetaDataApi = /** @class */ (function(_super) {
    __extends(StoreMetaDataApi, _super);

    function StoreMetaDataApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StoreMetaDataApi.prototype.getStoreMetaData = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: null,
                            query: getStoreMetaData,
                            operationName: GraphQLOperations.GetStoreMetaData,
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , __assign(__assign(__assign({}, response.data.storeInfo), response.data.shipping), response.data.payments)];
                }
            });
        });
    };
    return StoreMetaDataApi;
}(BaseApi));
export {
    StoreMetaDataApi
};
//# sourceMappingURL=StoreMetaDataApi.js.map