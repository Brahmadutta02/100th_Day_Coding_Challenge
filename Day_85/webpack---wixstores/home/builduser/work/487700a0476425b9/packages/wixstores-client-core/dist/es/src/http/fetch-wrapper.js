import {
    __assign,
    __awaiter,
    __generator,
    __rest
} from "tslib";
import {
    FetchError
} from './FetchError';
var FetchAdapter = /** @class */ (function() {
    function FetchAdapter() {
        this.history = [];
    }
    FetchAdapter.prototype.filterHeaders = function(headers) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var Authorization = headers.Authorization,
            filteredHeaders = __rest(headers, ["Authorization"]);
        return filteredHeaders;
    };
    FetchAdapter.prototype.post = function(url, bodyData, options) {
        return __awaiter(this, void 0, void 0, function() {
            var rawResponse, filteredHeaders, request, response, data;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , fetch(url, {
                            method: 'post',
                            body: JSON.stringify(bodyData),
                            headers: options.headers,
                        }).catch(function(e) {
                            throw new FetchError('Fetch error', {
                                originalError: e.message
                            });
                        })];
                    case 1:
                        rawResponse = _a.sent();
                        filteredHeaders = this.filterHeaders(options.headers);
                        request = {
                            url: url,
                            body: bodyData,
                            options: options,
                            filteredHeaders: filteredHeaders
                        };
                        return [4 /*yield*/ , this.handleRawResponse(rawResponse, {
                            request: request
                        })];
                    case 2:
                        response = _a.sent();
                        if (response.errors && response.errors.length) {
                            throw new FetchError(JSON.stringify(Array.isArray(response.errors) ? response.errors[0] : response.errors), {
                                request: request,
                                response: response,
                            });
                        }
                        if (response.success === false) {
                            throw new FetchError(response.errorDescription || 'Fetch error', {
                                request: request,
                                response: response,
                            });
                        }
                        data = response.data;
                        return [2 /*return*/ , {
                            data: data || response
                        }];
                }
            });
        });
    };
    FetchAdapter.prototype.get = function(url, options) {
        return __awaiter(this, void 0, void 0, function() {
            var rawResponse, response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , fetch(url, {
                            method: 'get',
                            headers: options.headers,
                        })];
                    case 1:
                        rawResponse = _a.sent();
                        return [4 /*yield*/ , this.handleRawResponse(rawResponse, {
                            request: {
                                url: url,
                                options: options
                            }
                        })];
                    case 2:
                        response = _a.sent();
                        if (response.errors && response.errors.length) {
                            throw new FetchError(JSON.stringify(Array.isArray(response.errors) ? response.errors[0] : response.errors), {
                                url: url,
                                response: response,
                            });
                        }
                        if (response.success === false) {
                            throw new FetchError(response.errorDescription || 'Fetch error', {
                                url: url,
                                response: response,
                            });
                        }
                        return [2 /*return*/ , response];
                }
            });
        });
    };
    FetchAdapter.prototype.delete = function(url, options) {
        return __awaiter(this, void 0, void 0, function() {
            var rawResponse;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , fetch(url, {
                            method: 'delete',
                            headers: options.headers,
                        })];
                    case 1:
                        rawResponse = _a.sent();
                        return [2 /*return*/ , this.handleRawResponse(rawResponse, {
                            request: {
                                url: url,
                                options: options
                            }
                        })];
                }
            });
        });
    };
    FetchAdapter.prototype.patch = function(url, data, options) {
        return __awaiter(this, void 0, void 0, function() {
            var rawResponse;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , fetch(url, {
                            method: 'path',
                            body: JSON.stringify(data),
                            headers: options.headers,
                        })];
                    case 1:
                        rawResponse = _a.sent();
                        return [2 /*return*/ , this.handleRawResponse(rawResponse, {
                            request: {
                                url: url,
                                body: data,
                                options: options
                            }
                        })];
                }
            });
        });
    };
    FetchAdapter.prototype.put = function(url, data, options) {
        return __awaiter(this, void 0, void 0, function() {
            var rawResponse;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , fetch(url, {
                            method: 'put',
                            body: JSON.stringify(data),
                            headers: options.headers,
                        })];
                    case 1:
                        rawResponse = _a.sent();
                        return [2 /*return*/ , this.handleRawResponse(rawResponse, {
                            request: {
                                url: url,
                                body: data,
                                options: options
                            }
                        })];
                }
            });
        });
    };
    FetchAdapter.prototype.handleRawResponse = function(rawResponse, data) {
        var _a = this.processResponse(rawResponse, data),
            url = _a.url,
            headers = _a.headers;
        if (rawResponse.status !== 200) {
            throw new FetchError("Got " + rawResponse.statusText + " (" + rawResponse.status + ") when requested: " + url, __assign({
                response: __assign(__assign({}, rawResponse), {
                    headers: headers
                })
            }, data));
        }
        return rawResponse.json();
    };
    FetchAdapter.prototype.processResponse = function(rawResponse, data) {
        var _a;
        var urlWithoutDomain = rawResponse.url && rawResponse.url.replace(/^.*\/\/[^/]+/, '');
        var requestUrl = (_a = data === null || data === void 0 ? void 0 : data.request) === null || _a === void 0 ? void 0 : _a.url;
        var headers = {};
        if ((rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.headers) && typeof rawResponse.headers.forEach === 'function') {
            rawResponse.headers.forEach(function(val, key) {
                headers[key] = val;
            });
        }
        var url = urlWithoutDomain || requestUrl;
        this.history.push({
            url: url,
            data: {
                headers: headers,
                rawResponse: rawResponse,
                body: data.request.body,
            },
        });
        return {
            url: url,
            headers: headers
        };
    };
    FetchAdapter.prototype.getHistory = function() {
        return this.history;
    };
    return FetchAdapter;
}());
export {
    FetchAdapter
};
//# sourceMappingURL=fetch-wrapper.js.map