"use strict";

var _require = require('./consts'),
    dataFixerMandatoryNonEmptyParams = _require.dataFixerMandatoryNonEmptyParams;

var toArray = function toArray(val) {
    return Array.isArray(val) ? val : [val];
};

var isInvalid = function isInvalid(value) {
    return !value || value === 'undefined' || value === 'null';
};

var isEmptyParam = function isEmptyParam(paramNames, paramValues) {
    return toArray(paramNames).reduce(function(res, paramName) {
        return res && isInvalid(paramValues[paramName]);
    }, true);
};

module.exports = function() {
    var dataFixerMandatoryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : dataFixerMandatoryNonEmptyParams;

    var isInvalidParamValue = function isInvalidParamValue(paramName, params) {
        var dataFixerMandatoryParam = dataFixerMandatoryParams[paramName];
        return dataFixerMandatoryParam && isEmptyParam(dataFixerMandatoryParam, params);
    };

    var getEmptyParams = function getEmptyParams(params) {
        return Object.keys(params).reduce(function(invalidParams, paramName) {
            return isInvalidParamValue(paramName, params) ? invalidParams.concat(paramName) : invalidParams;
        }, []);
    };

    return {
        getEmptyParams: getEmptyParams
    };
};
//# sourceMappingURL=emptyParamValuesValidator.js.map