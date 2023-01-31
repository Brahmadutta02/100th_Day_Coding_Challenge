import {
    registerCorvidEvent
} from '../corvidEvents';
export const changePropsSDKFactory = api => ({
    onChange: handler => registerCorvidEvent('onChange', api, handler),
});
//# sourceMappingURL=changePropsSDKFactory.js.map