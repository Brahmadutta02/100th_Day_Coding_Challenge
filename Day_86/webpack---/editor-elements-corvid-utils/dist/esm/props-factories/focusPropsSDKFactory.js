import {
    registerCorvidEvent
} from '../corvidEvents';
export const focusPropsSDKFactory = api => {
    return {
        focus: () => api.compRef.focus(),
        blur: () => api.compRef.blur(),
        onFocus: handler => registerCorvidEvent('onFocus', api, handler),
        onBlur: handler => registerCorvidEvent('onBlur', api, handler),
    };
};
//# sourceMappingURL=focusPropsSDKFactory.js.map