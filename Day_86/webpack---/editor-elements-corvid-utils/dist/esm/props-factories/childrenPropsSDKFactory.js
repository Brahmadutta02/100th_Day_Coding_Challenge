export const childrenPropsSDKFactory = ({
    getChildren
}) => {
    return {
        get children() {
            return getChildren();
        },
    };
};
//# sourceMappingURL=childrenPropsSDKFactory.js.map