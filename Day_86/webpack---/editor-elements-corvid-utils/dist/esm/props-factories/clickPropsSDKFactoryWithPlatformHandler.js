import {
    clickPropsSDKFactory,
} from './clickPropsSDKFactory';
export const clickPropsSDKFactoryWithUpdatePlatformHandler = api => {
    const clickPropsApi = clickPropsSDKFactory(api);
    const {
        setProps,
        props
    } = api;
    return Object.assign(Object.assign({}, clickPropsApi), {
        onClick: handler => {
            clickPropsApi.onClick(handler);
            if (!props.hasPlatformClickHandler) {
                setProps({
                    hasPlatformClickHandler: true,
                });
            }
        }
    });
};
//# sourceMappingURL=clickPropsSDKFactoryWithPlatformHandler.js.map