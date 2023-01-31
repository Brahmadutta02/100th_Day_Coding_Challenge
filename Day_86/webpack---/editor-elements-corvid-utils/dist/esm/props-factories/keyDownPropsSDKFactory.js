import {
    registerCorvidEvent
} from '../corvidEvents';
export const keyDownPropsSDKFactory = api => {
    return {
        onKeyDown: handler => registerCorvidEvent('onKeyDown', api, handler),
    };
};
//# sourceMappingURL=keyDownPropsSDKFactory.js.map