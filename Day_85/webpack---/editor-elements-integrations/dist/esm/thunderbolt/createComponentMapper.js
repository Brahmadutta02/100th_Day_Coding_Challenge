export const withCompInfo = () => (depsArray, resolver) => {
    const deps = depsArray.reduce((acc, key) => (Object.assign(Object.assign({}, acc), {
        [key]: true
    })), {});
    return {
        deps,
        resolver,
    };
};
export const withStateRefs = () => (depsArray, resolver) => {
    const refApiKey = 'refApi';
    const deps = [...depsArray, refApiKey];
    const withCompInfoFunc = withCompInfo();
    return withCompInfoFunc(deps, resolver);
};
const getStateRefGetters = (stateRefsKeys, refApi) => {
    const stateRefsGetters = Object.values(refApi).reduce((acc, featureDomain) => (Object.assign(Object.assign({}, acc), featureDomain)), {});
    return stateRefsKeys.reduce((acc, key) => {
        if (!stateRefsGetters[key]) {
            return acc;
        }
        return Object.assign(Object.assign({}, acc), {
            [key]: stateRefsGetters[key]()
        });
    }, {});
};
export const withStateRefsValues = (stateRefsKeys) => {
    return withCompInfo()(['refApi'], ({
        refApi
    }) => {
        return getStateRefGetters(stateRefsKeys, refApi);
    });
};
export function createComponentMapperModel(mapper) {
    return mapper;
}
const camelCaseToDashCase = (str) => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);
const patchControllerUtils = (controllerUtils) => {
    /**
     * From this: { marginTop: 10 }
     * to this { margin-top: 10 }
     */
    const patchedUpdateStyles = (reactStyles) => {
        const styles = Object.entries(reactStyles).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), {
            [camelCaseToDashCase(key)]: value === undefined ? null : value
        })), {});
        controllerUtils.updateStyles(styles);
    };
    return Object.assign(Object.assign({}, controllerUtils), {
        updateStyles: patchedUpdateStyles
    });
};
export const withCompController = (componentPropsCreator) => {
    return {
        useComponentProps: (mapperProps, stateValues, controllerUtils) => {
            const patchedUtils = patchControllerUtils(controllerUtils);
            return componentPropsCreator({
                mapperProps,
                stateValues,
                controllerUtils: patchedUtils,
            });
        },
    };
};
//# sourceMappingURL=createComponentMapper.js.map