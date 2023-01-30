"use strict";

var _require = require('./kendash'),
    notEmpty = _require.notEmpty,
    isFunction = _require.isFunction,
    differenceWith = _require.differenceWith;

var _require2 = require('./errors'),
    MissingMandatoryParamError = _require2.MissingMandatoryParamError;

var comparator = function comparator(arrVal, othVal) {
    return isFunction(arrVal) ? arrVal(othVal) : arrVal === othVal;
};

var emptyParamValuesValidator = require('./emptyParamValuesValidator');

module.exports = function(mandatoryParamNames) {
    var _emptyParamValuesVali = emptyParamValuesValidator(),
        getEmptyParams = _emptyParamValuesVali.getEmptyParams;

    return {
        validate: function validate(actualParams) {
            var missingMandatoryParams = differenceWith(mandatoryParamNames, Object.keys(actualParams), comparator);

            if (notEmpty(missingMandatoryParams)) {
                throw new MissingMandatoryParamError(missingMandatoryParams);
            }

            var invalidParams = getEmptyParams(actualParams);

            if (notEmpty(invalidParams)) {
                throw new MissingMandatoryParamError(invalidParams);
            }
        }
    };
};
//# sourceMappingURL=mandatoryParamsValidator.js.map