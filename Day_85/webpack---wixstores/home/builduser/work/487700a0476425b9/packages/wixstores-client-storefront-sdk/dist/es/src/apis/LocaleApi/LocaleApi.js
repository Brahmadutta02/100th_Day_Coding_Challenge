import {
    __awaiter,
    __extends,
    __generator,
    __read
} from "tslib";
import {
    BaseApi
} from '../BaseApi';
import {
    query as getLocaleDataQuery
} from '../../graphql/getLocaleData.graphql';
import {
    query as getCountryCodesQuery
} from '../../graphql/getCountryCodes.graphql';
import {
    GraphQLOperations
} from '../constants';
var LocaleApi = /** @class */ (function(_super) {
    __extends(LocaleApi, _super);

    function LocaleApi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localeData = {};
        _this.fetchDisplayNamesLocaleData = function(variables) {
            return __awaiter(_this, void 0, void 0, function() {
                var hashKey, response, countryName, regionName;
                var _a, _b;
                return __generator(this, function(_c) {
                    switch (_c.label) {
                        case 0:
                            hashKey = this.hashKey(variables);
                            if (!(this.localeData[hashKey] === undefined)) return [3 /*break*/ , 2];
                            return [4 /*yield*/ , this.fetch({
                                variables: variables,
                                query: getLocaleDataQuery,
                                operationName: GraphQLOperations.GetLocaleData,
                            })];
                        case 1:
                            response = _c.sent();
                            countryName = response.data.localeData.countries[0].displayName;
                            regionName = (_b = (_a = response.data.localeData.countries[0].subdivisions) === null || _a === void 0 ? void 0 : _a.regions[0]) === null || _b === void 0 ? void 0 : _b.displayName;
                            this.localeData[hashKey] = {
                                countryName: countryName,
                                regionName: regionName
                            };
                            _c.label = 2;
                        case 2:
                            return [2 /*return*/ , this.localeData[hashKey]];
                    }
                });
            });
        };
        return _this;
    }
    LocaleApi.prototype.hashKey = function(variables) {
        return Object.entries(variables).reduce(function(acc, _a) {
            var _b = __read(_a, 2),
                k = _b[0],
                v = _b[1];
            return acc + "-" + k + "-" + v;
        }, '');
    };
    LocaleApi.prototype.getDisplayNames = function(variables) {
        return this.fetchDisplayNamesLocaleData(variables);
    };
    LocaleApi.prototype.getCountryCodes = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {},
                            query: getCountryCodesQuery,
                            operationName: GraphQLOperations.GetCountryCodes,
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.data.localeData.countries];
                }
            });
        });
    };
    return LocaleApi;
}(BaseApi));
export {
    LocaleApi
};
//# sourceMappingURL=LocaleApi.js.map