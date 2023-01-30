import {
    __awaiter,
    __generator,
    __read,
    __values
} from "tslib";
import {
    Topology,
    FetchError
} from '@wix/wixstores-client-core';
var GraphqlClient = /** @class */ (function() {
    function GraphqlClient(_a) {
        var siteStore = _a.siteStore;
        this.siteStore = siteStore;
    }
    GraphqlClient.prototype.executeOperation = function(_a) {
        var query = _a.query,
            variables = _a.variables,
            operationName = _a.operationName,
            _b = _a.forcePost,
            forcePost = _b === void 0 ? false : _b,
            endpoint = _a.endpoint,
            _c = _a.selectErrorsFn,
            selectErrorsFn = _c === void 0 ? function() {
                return undefined;
            } : _c,
            _d = _a.source,
            source = _d === void 0 ? 'WixStoresWebClient' : _d;
        return __awaiter(this, void 0, void 0, function() {
            var params, response;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        params = {
                            query: query,
                            variables: variables,
                            operationName: operationName,
                            source: source,
                        };
                        if (!(!forcePost && endpoint.includes(Topology.NODE_GRAPHQL_URL))) return [3 /*break*/ , 2];
                        return [4 /*yield*/ , this.tryNodeGetGqlAndFallbackToPost(endpoint, params)];
                    case 1:
                        response = _e.sent();
                        return [3 /*break*/ , 6];
                    case 2:
                        if (!forcePost) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , this.siteStore.httpClient.post(endpoint, params)];
                    case 3:
                        response = _e.sent();
                        return [3 /*break*/ , 6];
                    case 4:
                        return [4 /*yield*/ , this.siteStore.tryGetGqlAndFallbackToPost(endpoint, params)];
                    case 5:
                        response = _e.sent();
                        _e.label = 6;
                    case 6:
                        if (selectErrorsFn(response)) {
                            throw new FetchError(selectErrorsFn(response));
                        }
                        return [2 /*return*/ , response];
                }
            });
        });
    };
    GraphqlClient.prototype.tryNodeGetGqlAndFallbackToPost = function(url, reqData, options) {
        var _this = this;
        return this.siteStore.httpClient
            .get(url, {
                queryParams: GraphqlClient.composeNodeGqlGetQueryParams(reqData),
            }, false)
            .catch(
                /* istanbul ignore next: todo(titk@wix.com): need to consider adding test */
                function() {
                    return _this.siteStore.httpClient.post(url, reqData, options);
                });
    };
    GraphqlClient.minifyGraphqlQuery = function(query) {
        return query
            .replace(/\s+/g, ' ')
            .replace(/\s?{\s?/g, '{')
            .replace(/\s?}\s?/g, '}')
            .trim();
    };
    GraphqlClient.composeNodeGqlGetQueryParams = function(reqData) {
        var e_1, _a;
        var query = GraphqlClient.minifyGraphqlQuery(reqData.query);
        var variables = reqData.variables ?
            /* istanbul ignore next: todo(titk@wix.com): remove when there will be at least one Gql Get call with variables */
            JSON.stringify(reqData.variables) :
            null;
        var operationName = reqData.operationName;
        var result = {};
        try {
            for (var _b = __values(Object.entries({
                    query: query,
                    variables: variables,
                    operationName: operationName,
                })), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2),
                    key = _d[0],
                    value = _d[1];
                if (value) {
                    result[key] = value;
                }
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        return result;
    };
    return GraphqlClient;
}());
export {
    GraphqlClient
};
//# sourceMappingURL=GraphqlClient.js.map