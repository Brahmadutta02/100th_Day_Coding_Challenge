import {
    assert
} from '../assert';
import {
    withValidation
} from '../validations';
import {
    registerCorvidMouseEvent
} from '../corvidEvents';
import {
    reportError
} from '../reporters';
import {
    getLink,
    getLabel,
    LinkTypeError,
    InvalidLabelError,
    getMenuItemsSchema,
    validateMenuItemsDepth,
    validateMenuItemsTarget,
    transformSdkDataToPropData,
    transformPropDataToSdkData,
} from './menuUtils';
const _menuItemsPropsSDKFactory = api => {
    const {
        setProps,
        props,
        platformUtils: {
            linkUtils
        },
        sdkData: {
            pageList
        } = {},
    } = api;
    if (!pageList) {
        reportError('Page list is not passed into sdkData. Provide it in component mapper to use menuItems SDK properly.');
    }
    const getMenuItems = (items) => {
        if (assert.isArray(items)) {
            return items.map(createMenuDataItem);
        }
        return [];
    };
    const createMenuDataItem = (menuDataItem, index) => {
        const menuSdkItem = {};
        try {
            const linkData = getLink({
                linkUtils,
                link: menuDataItem.link,
                target: menuDataItem.target || '_self',
            });
            if (linkData.href) {
                menuSdkItem.link = linkData.href;
                menuSdkItem.target = linkData.target || '_self';
            }
        } catch (error) {
            throw new LinkTypeError(menuDataItem.link || '', index);
        }
        const label = getLabel({
            label: menuDataItem.label,
            link: menuDataItem.link,
            pageList: pageList,
        });
        if (assert.isNil(label)) {
            throw new InvalidLabelError(index);
        }
        menuSdkItem.label = label;
        if (!assert.isNil(menuDataItem.selected)) {
            menuSdkItem.selected = menuDataItem.selected;
        }
        return Object.assign(Object.assign({}, menuSdkItem), {
            menuItems: getMenuItems(menuDataItem.menuItems)
        });
    };
    return {
        get menuItems() {
            var _a, _b, _c;
            const value = (_b = (_a = props.items) === null || _a === void 0 ? void 0 : _a.map(transformPropDataToSdkData)) !== null && _b !== void 0 ? _b : [];
            return (_c = value === null || value === void 0 ? void 0 : value.map(createMenuDataItem)) !== null && _c !== void 0 ? _c : [];
        },
        set menuItems(value) {
            var _a;
            try {
                setProps({
                    items: (_a = value === null || value === void 0 ? void 0 : value.map(createMenuDataItem).map(transformSdkDataToPropData)) !== null && _a !== void 0 ? _a : [],
                });
            } catch (error) {
                reportError(error.message);
            }
        },
        onItemMouseIn: handler => registerCorvidMouseEvent('onItemMouseIn', api, handler, payload => ({
            item: transformPropDataToSdkData(payload),
            type: 'itemMouseIn',
        })),
        onItemMouseOut: handler => registerCorvidMouseEvent('onItemMouseOut', api, handler, payload => ({
            item: transformPropDataToSdkData(payload),
            type: 'itemMouseOut',
        })),
        onItemClick: handler => registerCorvidMouseEvent('onItemClick', api, handler, payload => ({
            item: transformPropDataToSdkData(payload),
            type: 'itemMouseClick',
        })),
        onItemDblClick: handler => registerCorvidMouseEvent('onItemDblClick', api, handler, payload => ({
            item: transformPropDataToSdkData(payload),
            type: 'itemMouseDblClick',
        })),
    };
};
export function menuItemsPropsSDKFactory(api) {
    const {
        sdkData: {
            isSubSubEnabled = false
        } = {}
    } = api;
    const menuItemsDepth = isSubSubEnabled ? 2 : 1;
    return withValidation(_menuItemsPropsSDKFactory, getMenuItemsSchema(menuItemsDepth), {
        menuItems: [
            validateMenuItemsDepth(menuItemsDepth),
            validateMenuItemsTarget,
        ],
    })(api);
}
//# sourceMappingURL=menuItemsPropsSDKFactory.js.map