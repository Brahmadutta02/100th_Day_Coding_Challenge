import {
    getTaxSettings
} from './getTaxSettings';
import {
    getPriceRangeSettings
} from './getPriceRangeSettings';
import {
    getShippingSettings
} from './getShippingSettings';
import {
    getCountryCodes
} from './getCountryCodes';
export function createSettingsExports(_a) {
    var context = _a.context,
        origin = _a.origin;
    return {
        getSettings: function() {
            return {
                price: getPriceRangeSettings(context.siteStore),
                tax: getTaxSettings(context.siteStore),
                shipping: getShippingSettings(context.siteStore),
                storeId: context.siteStore.storeId,
                instance: context.siteStore.instanceManager.getInstance(),
                storeCurrency: context.siteStore.currency,
                locale: context.siteStore.locale,
            };
        },
        getCountryCodes: getCountryCodes({
            context: context,
            origin: origin
        }),
        getCurrentCurrency: function() {
            return context.siteStore.getCurrentCurrency();
        },
    };
}
//# sourceMappingURL=wixcode.settings.js.map