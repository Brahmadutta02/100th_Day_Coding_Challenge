import {
    __assign
} from "tslib";
import _ from 'lodash';
var sentryReporterInstance;
var shouldWrapAsyncFunctionsWithPromise = false;
export function setSentryInstance(sentryInstance) {
    sentryReporterInstance = sentryInstance;
}
export function wrapAsyncFunctionsWithPromise(shouldWrap) {
    shouldWrapAsyncFunctionsWithPromise = shouldWrap;
}
export var wrapTryCatch = function(onCatch) {
    return function(fn) {
        return function() {
            try {
                return shouldWrapAsyncFunctionsWithPromise ? //eslint-disable-next-line prefer-spread,prefer-rest-params
                    Promise.resolve(fn.apply(null, arguments)).catch(onCatch) : //eslint-disable-next-line prefer-spread,prefer-rest-params
                    fn.apply(null, arguments);
            } catch (e) {
                /* istanbul ignore next: todo: test */
                onCatch === null || onCatch === void 0 ? void 0 : onCatch(e);
            }
        };
    };
};
/* istanbul ignore next: todo: test */
export var errorReporter = function(e) {
    sentryReporterInstance === null || sentryReporterInstance === void 0 ? void 0 : sentryReporterInstance.captureException(e);
    throw e;
};
export function withErrorReportingWrapping(obj) {
    return withErrorReporting(errorReporter)(obj);
}
export function withErrorReporting(errorReporterFn) {
    return function(obj) {
        var wrapper = wrapTryCatch(errorReporterFn);
        return _.reduce(obj, function(result, value, key) {
            var _a;
            return (__assign(__assign({}, result), (_a = {}, _a[key] = _.isFunction(value) ? wrapper(value) : value, _a)));
        }, {});
    };
}
export function createFakeRaven() {
    /* istanbul ignore next: todo: test */
    return function(_dsn) {
        return _.noop;
    };
}
export function createControllerRaven(platformServices, userContext, siteStore) {
    return function(dsn, ravenOptions) {
        var raven = platformServices.monitoring.createMonitor(dsn, function(data) {
            data.environment = 'Worker';
            Object.assign(data, ravenOptions);
            return data;
        });
        raven.setUserContext(userContext);
        return function(ex, options) {
            raven.setExtraContext(ex);
            siteStore.fetchAdapter.getHistory().forEach(
                /* istanbul ignore next: todo: test */
                function(h) {
                    var _a, _b;
                    var response = _.omit(h.data.rawResponse, 'headers');
                    raven.captureBreadcrumb({
                        message: "Fetch " + h.url,
                        category: 'http',
                        type: 'http',
                        data: {
                            body: (_a = JSON.stringify(h.data.body)) === null || _a === void 0 ? void 0 : _a.substr(0, 100),
                            errors: h.data.rawResponse.errors,
                            response: (_b = JSON.stringify(response)) === null || _b === void 0 ? void 0 : _b.substr(0, 300),
                            status: h.data.rawResponse.status,
                            headers: h.data.headers,
                        },
                    });
                });
            raven.captureException(ex, options);
            raven.setExtraContext();
            console.error(ex);
            //eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw ex;
        };
    };
}
//# sourceMappingURL=errorReporter.js.map