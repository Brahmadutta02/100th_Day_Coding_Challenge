import {
    __assign
} from "tslib";
import biLoggerSite from '@wix/bi-logger-ec-site';
export var createOOIPlatformSiteBILogger = function(biToken, defaults, biLogger, debug) {
    if (defaults === void 0) {
        defaults = {};
    }
    if (debug === void 0) {
        debug = false;
    }
    var loggerInstance = biLoggerSite(biLogger)({
        host: debug ? 'frog.wixpress.com' : undefined,
    });
    loggerInstance.util.updateDefaults(__assign(__assign({}, defaults), {
        bi_token: biToken
    }));
    return loggerInstance;
};
//# sourceMappingURL=configure-ooi-platform-site-bi-logger.js.map