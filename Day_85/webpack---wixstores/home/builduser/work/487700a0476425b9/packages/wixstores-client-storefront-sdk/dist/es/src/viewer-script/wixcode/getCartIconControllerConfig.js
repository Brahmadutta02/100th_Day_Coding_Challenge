import {
    StoresWidgetID
} from '@wix/wixstores-client-core';
export function getCartIconControllerConfig(context) {
    return context.controllerConfigs.find(function(c) {
        return c.type === StoresWidgetID.CART_ICON;
    });
}
//# sourceMappingURL=getCartIconControllerConfig.js.map