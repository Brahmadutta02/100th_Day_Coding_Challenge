export const deletePropsSDKFactory = api => ({
    delete: () => {
        api.setProps({
            deleted: true
        });
        api.remove();
    },
    restore: () => {
        api.setProps({
            deleted: false
        });
        api.restore();
    },
    get deleted() {
        return !!api.props.deleted;
    },
});
//# sourceMappingURL=deletePropsSDKFactory.js.map