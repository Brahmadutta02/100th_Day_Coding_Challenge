import {
    registerCorvidMouseEvent,
    unregisterCorvidEvent,
} from '../corvidEvents';
import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    messageTemplates
} from '../messages';
import {
    reportError
} from '../reporters';
import {
    basePropsSDKFactory
} from './basePropsSDKFactory';
import {
    createViewportPropsSDKFactory
} from './viewportPropsSDKFactory';
import {
    createVisibilityPropsSDKFactory
} from './visibilityPropsSDKFactory';
import {
    effectsTriggersSDKFactory
} from './effectsTriggersSDKFactory';
import {
    deletePropsSDKFactory
} from './deletePropsSDKFactory';
export const toJSONBase = ({
    role,
    compType,
    isGlobal,
    isRendered,
}) => ({
    id: role,
    type: `$w.${compType}`,
    global: isGlobal(),
    rendered: isRendered(),
});
export const baseElementPropsSDKFactory = api => ({
    onMouseIn: handler => registerCorvidMouseEvent('onMouseEnter', api, handler),
    onMouseOut: handler => registerCorvidMouseEvent('onMouseLeave', api, handler),
    removeEventHandler: (type, handler) => {
        const {
            getSdkInstance
        } = api;
        if (typeof type !== 'string') {
            reportError(messageTemplates.error_type({
                propertyName: 'type',
                functionName: 'removeEventHandler',
                value: type,
                expectedType: 'string',
            }));
            return getSdkInstance();
        }
        if (typeof handler !== 'function') {
            reportError(messageTemplates.error_type({
                propertyName: 'handler',
                functionName: 'removeEventHandler',
                value: handler,
                expectedType: 'function',
            }));
            return getSdkInstance();
        }
        return unregisterCorvidEvent(type, api, handler);
    },
    get rendered() {
        return api.metaData.isRendered();
    },
    toJSON() {
        return toJSONBase(api.metaData);
    },
});
const viewportPropsSDKFactory = createViewportPropsSDKFactory();
export const elementPropsSDKFactory = composeSDKFactories(basePropsSDKFactory, viewportPropsSDKFactory, baseElementPropsSDKFactory, effectsTriggersSDKFactory);
export const createElementPropsSDKFactory = ({
    useHiddenCollapsed = true,
    hasPortal = false,
} = {}) => {
    return composeSDKFactories(basePropsSDKFactory, baseElementPropsSDKFactory, effectsTriggersSDKFactory, deletePropsSDKFactory, useHiddenCollapsed ?
        createVisibilityPropsSDKFactory(hasPortal) :
        viewportPropsSDKFactory);
};
//# sourceMappingURL=elementPropsSDKFactory.js.map