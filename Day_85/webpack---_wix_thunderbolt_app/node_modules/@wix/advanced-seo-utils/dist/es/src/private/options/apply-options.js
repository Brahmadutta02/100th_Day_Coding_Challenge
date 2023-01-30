var applyOptions = function(options) {
    if (options === void 0) {
        options = {};
    }
    return ({
        'options.disable-pattern-schema': !!options.disablePatternStructureData,
    });
};
export {
    applyOptions
};