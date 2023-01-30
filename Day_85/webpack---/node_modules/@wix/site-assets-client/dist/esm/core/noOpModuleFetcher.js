export var NoOpModuleFetcher = {
    fetch: function() {
        throw Error('fallback is disabled - should never get here!');
    }
};