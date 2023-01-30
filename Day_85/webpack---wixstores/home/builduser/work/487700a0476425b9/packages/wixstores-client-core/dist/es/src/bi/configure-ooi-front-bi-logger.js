import {
    __assign
} from "tslib";
import biLoggerStoreFront from '@wix/bi-logger-ec-sf';
export var createOOIStoreFrontBILogger = function(userId, biToken, defaults, biLogger, debug) {
    if (defaults === void 0) {
        defaults = {};
    }
    if (debug === void 0) {
        debug = false;
    }
    var defaultsWithId = __assign(__assign(__assign({}, defaults), {
        bi_token: biToken
    }), userId);
    var loggerInstance = biLoggerStoreFront(biLogger)({
        host: debug ? 'frog.wixpress.com' : undefined,
    });
    loggerInstance.util.updateDefaults(defaultsWithId);
    return loggerInstance;
};
//# sourceMappingURL=configure-ooi-front-bi-logger.js.map