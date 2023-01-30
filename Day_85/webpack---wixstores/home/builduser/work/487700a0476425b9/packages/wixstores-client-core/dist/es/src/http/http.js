import {
    __assign,
    __extends
} from "tslib";
import _ from 'lodash';
import {
    UrlParser
} from '../url-parser';
import {
    getHttpCommonHeaders
} from '../common/http';
import {
    CURRENCY_HEADER_NAME
} from '../constants';
var Http = /** @class */ (function() {
    function Http(httpTransport) {
        this.httpTransport = httpTransport;
    }
    Http.prototype.post = function(urlTamplate, data, options) {
        if (options === void 0) {
            options = {};
        }
        var parsedUrl = new UrlParser(urlTamplate).generate(options.templateParams, options.queryParams);
        var headers = this.getBaseHeaders();
        return this.httpTransport.post(parsedUrl, data, {
            headers: headers
        });
    };
    Http.prototype.get = function(url, options, withCacheKiller, withParser) {
        if (options === void 0) {
            options = {};
        }
        if (withCacheKiller === void 0) {
            withCacheKiller = true;
        }
        if (withParser === void 0) {
            withParser = true;
        }
        var queryParams = _.merge({}, options.queryParams, withCacheKiller ? {
            cacheKiller: Date.now()
        } : {});
        var parsedUrl = withParser ? new UrlParser(url).generate(options.templateParams, queryParams) : url;
        var headers = this.getBaseHeaders();
        return this.httpTransport.get(parsedUrl, {
            headers: headers
        });
    };
    Http.prototype.delete = function(url, options) {
        if (options === void 0) {
            options = {};
        }
        var parsedUrl = new UrlParser(url).generate(options.templateParams, options.queryParams);
        var headers = this.getBaseHeaders();
        return this.httpTransport.delete(parsedUrl, {
            headers: headers
        });
    };
    Http.prototype.patch = function(urlTamplate, data, options) {
        if (options === void 0) {
            options = {};
        }
        var parsedUrl = new UrlParser(urlTamplate).generate(options.templateParams, options.queryParams);
        var headers = this.getBaseHeaders();
        return this.httpTransport.patch(parsedUrl, data, {
            headers: headers
        });
    };
    Http.prototype.put = function(urlTamplate, data, options) {
        if (options === void 0) {
            options = {};
        }
        var parsedUrl = new UrlParser(urlTamplate).generate(options.templateParams, options.queryParams);
        var headers = this.getBaseHeaders();
        return this.httpTransport.put(parsedUrl, data, {
            headers: headers
        });
    };
    return Http;
}());
export {
    Http
};
var WixStoresHttp = /** @class */ (function(_super) {
    __extends(WixStoresHttp, _super);

    function WixStoresHttp(instanceResolver, httpTransport, currencyResolver) {
        var _this = _super.call(this, httpTransport) || this;
        _this.instanceResolver = instanceResolver;
        _this.httpTransport = httpTransport;
        _this.currencyResolver = currencyResolver;
        _this.headers = {};
        return _this;
    }
    WixStoresHttp.prototype.addHeaders = function(headers) {
        this.headers = __assign(__assign({}, this.headers), headers);
    };
    WixStoresHttp.prototype.getCurrencyHeader = function(currency) {
        var _a;
        return currency ?
            (_a = {},
                _a[CURRENCY_HEADER_NAME] = currency,
                _a) : {};
    };
    WixStoresHttp.prototype.getBaseHeaders = function() {
        return __assign(__assign(__assign(__assign({}, getHttpCommonHeaders(this.instanceResolver.getInstance())), this.getCurrencyHeader(this.currencyResolver ? this.currencyResolver() : null)), {
            'Content-Type': 'application/json; charset=utf-8'
        }), this.headers);
    };
    return WixStoresHttp;
}(Http));
export {
    WixStoresHttp
};
//# sourceMappingURL=http.js.map