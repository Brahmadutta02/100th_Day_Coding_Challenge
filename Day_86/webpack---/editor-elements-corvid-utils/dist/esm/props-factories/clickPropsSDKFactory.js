import {
    registerCorvidMouseEvent
} from '../corvidEvents';
export const clickPropsSDKFactory = api => ({
    onClick: handler => registerCorvidMouseEvent('onClick', api, handler),
    onDblClick: handler => registerCorvidMouseEvent('onDblClick', api, handler),
});
//# sourceMappingURL=clickPropsSDKFactory.js.map