import {
    __spreadArray
} from "tslib";
import * as _ from 'lodash';
import {
    FormsFieldPreset
} from '../constants';
import {
    CURRENCIES
} from './currencies';
export var getCurrencyByKey = function(currencyKey) {
    return CURRENCIES[currencyKey];
};
export var paymentMappingToRadioOptions = function(paymentItemsMapping, currency, _a) {
    var t = _a.t;
    return _.reduce(paymentItemsMapping, function(acc, currentValue, currentKey) {
        return __spreadArray(__spreadArray([], acc, true), [{
            label: t("fieldTypes.".concat(FormsFieldPreset.GENERAL_ITEMS_LIST, ".itemName"), {
                currency: getCurrencyByKey(currency).symbol,
                name: currentValue.label,
                price: currentValue.price,
            }),
            value: currentKey,
        }, ], false);
    }, []);
};
export var validatePriceValue = function(_a) {
    var priceValue = _a.priceValue,
        currencyKey = _a.currencyKey,
        _b = _a.allowZero,
        allowZero = _b === void 0 ? false : _b;
    var num = Number(priceValue);
    var isGtZero = allowZero ? num >= 0 : num > 0;
    var isValidNumber = _.isFinite(num) && isGtZero;
    if (!isValidNumber) {
        return isValidNumber;
    }
    var fractionSize = _.size(_.get(_.split(priceValue, '.'), '[1]'));
    var currencyData = getCurrencyByKey(currencyKey);
    var isValidFractionSize = fractionSize <= currencyData.fraction;
    return isValidFractionSize;
};
//# sourceMappingURL=helpers.js.map