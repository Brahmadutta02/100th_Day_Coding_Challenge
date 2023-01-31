import {
    assert
} from '../../assert';
const sanitizeItem = (item) => Object.entries(item).reduce((acc, [key, value]) => {
    if (assert.isNil(value)) {
        return acc;
    } else if (!assert.isDate(value)) {
        if (assert.isObject(value)) {
            return Object.assign(Object.assign({}, acc), {
                [key]: sanitizeItem(value)
            });
        } else if (assert.isArray(value)) {
            return Object.assign(Object.assign({}, acc), {
                [key]: value.map(sanitizeItem)
            });
        }
    }
    return Object.assign(Object.assign({}, acc), {
        [key]: value
    });
}, {});
/**
 * All validations should be handled by
 * schema validator, so every value should be valid
 */
export const transformPropDataToSdkData = (menuDataItem) => {
    var _a, _b, _c;
    return sanitizeItem({
        label: menuDataItem.label,
        link: (_a = menuDataItem.link) === null || _a === void 0 ? void 0 : _a.href,
        selected: menuDataItem.selected,
        target: (_b = menuDataItem.link) === null || _b === void 0 ? void 0 : _b.target,
        menuItems: (_c = menuDataItem.items) === null || _c === void 0 ? void 0 : _c.map(transformPropDataToSdkData),
    });
};
/**
 * All validations should be handled by
 * schema validator, so every value should be valid
 */
export const transformSdkDataToPropData = (sdkMenuItem) => {
    var _a;
    return sanitizeItem({
        label: sdkMenuItem.label || '',
        link: {
            href: sdkMenuItem.link,
            target: sdkMenuItem.target,
        },
        isVisible: true,
        isVisibleMobile: true,
        selected: sdkMenuItem.selected,
        items: (_a = sdkMenuItem.menuItems) === null || _a === void 0 ? void 0 : _a.map(transformSdkDataToPropData),
    });
};
//# sourceMappingURL=transformers.js.map