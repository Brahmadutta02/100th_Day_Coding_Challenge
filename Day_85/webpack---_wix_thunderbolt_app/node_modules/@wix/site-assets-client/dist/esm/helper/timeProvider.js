export var DateTimeProvider = function() {
    return {
        now: function() {
            return Date.now();
        }
    };
};