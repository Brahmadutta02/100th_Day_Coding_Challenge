import {
    __awaiter,
    __generator
} from "tslib";
import {
    Topology
} from '@wix/wixstores-client-core';
import {
    RemoteSourceTypes
} from './constants';
import {
    GraphqlClient
} from './GraphqlClient';
var BaseApi = /** @class */ (function() {
    function BaseApi(_a) {
        var siteStore = _a.siteStore,
            origin = _a.origin;
        this.origin = origin;
        this.siteStore = siteStore;
        this.graphqlClient = new GraphqlClient({
            siteStore: siteStore
        });
    }
    BaseApi.prototype.absoluteUrl = function(url) {
        return this.siteStore.resolveAbsoluteUrl(url);
    };
    Object.defineProperty(BaseApi.prototype, "endpoints", {
        get: function() {
            var _a;
            var _this = this;
            return _a = {},
                _a[RemoteSourceTypes.ScalaReadOnly] = this.absoluteUrl("/" + Topology.STOREFRONT_GRAPHQL_URL),
                _a[RemoteSourceTypes.ScalaReadWrite] = this.absoluteUrl("/" + Topology.READ_WRITE_GRAPHQL_URL),
                _a[RemoteSourceTypes.NodeReadWrite] = this.absoluteUrl("/" + Topology.NODE_GRAPHQL_URL),
                _a[RemoteSourceTypes.NodeReadWriteForcePlatform] = this.absoluteUrl("/" + Topology.NODE_GRAPHQL_URL + "?forceNodeOnlyResponse=true"),
                _a.cartCommmands = function(command) {
                    return _this.absoluteUrl("" + Topology.CART_COMMANDS_URL.replace('{commandName}', command));
                },
                _a;
        },
        enumerable: false,
        configurable: true
    });
    BaseApi.prototype.post = function(url, data, queryParams) {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.siteStore.httpClient.post(url, data, {
                            queryParams: queryParams
                        }).catch(function(e) {
                            /* istanbul ignore if */
                            if (e.data && e.data.response && e.data.response.errors) {
                                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                                throw {
                                    success: false,
                                    errors: e.data.response.errors
                                };
                            }
                            // eslint-disable-next-line @typescript-eslint/no-throw-literal
                            throw e;
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/ , response.data];
                }
            });
        });
    };
    BaseApi.prototype.fetch = function(_a, remoteSource, forcePost, selectErrorsFn) {
        var query = _a.query,
            variables = _a.variables,
            operationName = _a.operationName,
            source = _a.source;
        if (remoteSource === void 0) {
            remoteSource = RemoteSourceTypes.ScalaReadWrite;
        }
        var endpoint = this.endpoints[remoteSource];
        return this.graphqlClient.executeOperation({
            query: query,
            variables: variables,
            operationName: operationName,
            forcePost: forcePost,
            endpoint: endpoint,
            selectErrorsFn: selectErrorsFn,
            source: source,
        });
    };
    BaseApi.prototype.mutate = function(params, selectErrorsFn) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.fetch(params, RemoteSourceTypes.NodeReadWrite, true, selectErrorsFn).then(function(res) {
                    return res.data;
                })];
            });
        });
    };
    return BaseApi;
}());
export {
    BaseApi
};
//# sourceMappingURL=BaseApi.js.map