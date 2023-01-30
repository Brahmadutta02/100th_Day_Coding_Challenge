import {
    __assign
} from "tslib";
export var createOOIWebBILogger = function(_a) {
    var user = _a.user,
        biToken = _a.biToken,
        _b = _a.defaults,
        defaults = _b === void 0 ? {} : _b,
        _c = _a.isDebug,
        isDebug = _c === void 0 ? false : _c,
        biLoggerFactory = _a.biLoggerFactory;
    var defaultEventArgs = __assign(__assign(__assign({}, defaults), {
        bi_token: biToken
    }), user);
    var host = isDebug ? 'frog.wixpress.com' : undefined;
    var loggerFactory = biLoggerFactory({
        host: host
    });
    if (loggerFactory.factory) {
        loggerFactory = loggerFactory.factory({
            host: host
        });
    }
    return loggerFactory.updateDefaults(defaultEventArgs).logger();
};
//# sourceMappingURL=configure-ooi-web-bi-logger.js.map