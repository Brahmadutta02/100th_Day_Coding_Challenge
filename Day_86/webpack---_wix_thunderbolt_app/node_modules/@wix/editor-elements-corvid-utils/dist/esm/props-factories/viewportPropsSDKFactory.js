import {
    registerCorvidEvent
} from '../corvidEvents';
import {
    createCompSchemaValidator
} from '../validations';
export const createViewportPropsSDKFactory = (registerCallback) => {
    return api => {
        const {
            metaData,
            getSdkInstance,
            create$w,
            createEvent
        } = api;
        const functionValidator = (value, setterName) => createCompSchemaValidator(metaData.role)(value, {
            type: ['function'],
        }, setterName);
        return {
            onViewportEnter: cb => {
                if (!functionValidator(cb, 'onViewportEnter')) {
                    return getSdkInstance();
                }
                registerCallback === null || registerCallback === void 0 ? void 0 : registerCallback('onViewportEnter', () => {
                    const corvidEvent = createEvent({
                        type: 'viewportEnter'
                    });
                    const $w = create$w();
                    cb(corvidEvent, $w);
                });
                return registerCorvidEvent('onViewportEnter', api, cb);
            },
            onViewportLeave: cb => {
                if (!functionValidator(cb, 'onViewportLeave')) {
                    return getSdkInstance();
                }
                registerCallback === null || registerCallback === void 0 ? void 0 : registerCallback('onViewportLeave', () => {
                    const corvidEvent = createEvent({
                        type: 'viewportLeave'
                    });
                    const $w = create$w();
                    cb(corvidEvent, $w);
                });
                return registerCorvidEvent('onViewportLeave', api, cb);
            },
        };
    };
};
//# sourceMappingURL=viewportPropsSDKFactory.js.map