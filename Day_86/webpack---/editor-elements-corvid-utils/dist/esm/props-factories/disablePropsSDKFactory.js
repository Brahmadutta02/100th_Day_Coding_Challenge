export const disablePropsSDKFactory = ({
    setProps,
    props
}) => ({
    get enabled() {
        return typeof props.isDisabled !== 'undefined' ? !props.isDisabled : true;
    },
    disable: () => {
        setProps({
            isDisabled: true
        });
        return Promise.resolve();
    },
    enable: () => {
        setProps({
            isDisabled: false
        });
        return Promise.resolve();
    },
});
//# sourceMappingURL=disablePropsSDKFactory.js.map