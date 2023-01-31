export var keys = function(obj) {
    return Object.keys(obj);
};
export var entries = function(obj) {
    return Object.entries(obj);
};
export var stringifyValues = function(obj) {
    return Object.fromEntries(entries(obj)
        .map(function(_a) {
            var key = _a[0],
                value = _a[1];
            return [key, value.toString()];
        }));
};
export var concatUnique = function(anArray, anotherArray) {
    return Array.from(new Set(anArray.concat(anotherArray)));
};