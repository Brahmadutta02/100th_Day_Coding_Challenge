export const basePropsSDKFactory = ({
    handlers,
    metaData,
}) => {
    const {
        compId,
        connection,
        compType,
        isGlobal,
        getParent,
        role,
        wixCodeId
    } = metaData;
    const type = `$w.${compType}`;
    return {
        get id() {
            return wixCodeId || role; // TODO check with @zivp if forms need this "|| role" and if not remove it.
        },
        get role() {
            return role;
        },
        get connectionConfig() {
            return connection === null || connection === void 0 ? void 0 : connection.config;
        },
        get uniqueId() {
            return compId;
        },
        get parent() {
            return getParent();
        },
        get global() {
            return isGlobal();
        },
        get type() {
            return type;
        },
        scrollTo() {
            return new Promise(resolve => handlers.scrollToComponent(compId, resolve));
        },
        toJSON() {
            return {
                id: role,
                type,
                global: isGlobal()
            };
        },
    };
};
//# sourceMappingURL=basePropsSDKFactory.js.map