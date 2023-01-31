import {
    registerCorvidEvent
} from '../corvidEvents';
export const keyUpPropsSDKFactory = api => {
    return {
        onKeyUp: handler => registerCorvidEvent('onKeyUp', api, handler),
    };
};
//# sourceMappingURL=keyUpPropsSDKFactory.js.map