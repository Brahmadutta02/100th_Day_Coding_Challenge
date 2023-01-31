import * as _ from 'lodash';
import {
    COUNTRIES_CODES
} from './constants';
export {
    COUNTRIES_CODES
};
// KEY NOT UNIQUE!
var AVAILBLE_COUNTRY_CODES = Object.values(COUNTRIES_CODES);
export var getCountryCodeByGEO = function(geo) {
    if (_.isFinite(Number(geo))) {
        return AVAILBLE_COUNTRY_CODES.includes(geo) ? geo : undefined;
    }
    return COUNTRIES_CODES[geo];
};
//# sourceMappingURL=index.js.map