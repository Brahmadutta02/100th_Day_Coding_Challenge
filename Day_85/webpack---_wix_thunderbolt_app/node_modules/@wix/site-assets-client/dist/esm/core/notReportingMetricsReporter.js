export var NotReportingMetricsReporter = {
    reportAsyncWithCustomKey: function(asyncMethod) {
        return asyncMethod();
    },
    runAsyncAndReport: function(asyncMethod) {
        return asyncMethod();
    },
    runAndReport: function(method) {
        return method();
    },
    reportError: function() {
        // do nothing
    },
    meter: function() {
        // do nothing
    },
    histogram: function() {
        // do nothing
    }
};