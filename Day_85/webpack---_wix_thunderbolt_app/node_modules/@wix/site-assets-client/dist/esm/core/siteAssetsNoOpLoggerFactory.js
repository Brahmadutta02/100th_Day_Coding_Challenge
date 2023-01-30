var noop = function() {
    // do nothing
};
export var noOpSiteAssetsLogger = {
    debug: noop,
    error: noop,
    warn: noop,
    info: noop,
    trace: noop,
};
export var noOpSiteAssetsLoggerFactory = {
    build: function() {
        return noOpSiteAssetsLogger;
    }
};