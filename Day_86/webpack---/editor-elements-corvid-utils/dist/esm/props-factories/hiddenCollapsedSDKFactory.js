import {
    createEffectValidation
} from './validations';
import {
    effectDefaultOptions,
    EFFECTS,
    sharedEffectDefaultOptions,
} from './animations';
export const createHiddenCollapsedSDKFactory = ({
    viewportState,
    hasPortal = false,
} = {}) => ({
    setStyles,
    portal,
    metaData,
    getSdkInstance,
    runAnimation,
    createSdkState,
    styleUtils,
    setProps,
}) => {
    const validateEffect = createEffectValidation({
        compName: metaData.role,
    });
    const [state, setState] = createSdkState({
        hidden: metaData.hiddenOnLoad,
        collapsed: metaData.collapsedOnLoad,
    }, 'hidden-collapsed');
    return {
        hide: async (effectName, effectOptions) => {
            var _a;
            setProps({
                hidden: true
            });
            if (state.collapsed || state.hidden) {
                setState({
                    hidden: true
                });
                return;
            }
            /**
             * If effect options and value are valid - the visibility css rules
             * are controlled by animation library.
             * If not - we set styles through corvid.
             */
            if (validateEffect({
                    effectName,
                    effectOptions,
                    propertyName: 'hide',
                })) {
                const animationOptions = {
                    animationDirection: EFFECTS.HIDE.suffix,
                    effectName,
                    effectOptions: Object.assign(Object.assign({}, ((effectDefaultOptions === null || effectDefaultOptions === void 0 ? void 0 : effectDefaultOptions[effectName]) ||
                        sharedEffectDefaultOptions)), effectOptions),
                };
                await Promise.all([
                    runAnimation(animationOptions),
                    hasPortal ? portal.runAnimation(animationOptions) : undefined,
                ]);
            } else {
                setStyles(styleUtils.getHiddenStyles());
                if (hasPortal) {
                    portal.setStyles(styleUtils.getHiddenStyles());
                }
            }
            setState({
                hidden: true
            });
            (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportLeave) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb());
        },
        show: async (effectName, effectOptions) => {
            var _a;
            setProps({
                hidden: false
            });
            if (state.collapsed || !state.hidden) {
                setState({
                    hidden: false
                });
                return;
            }
            /**
             * If effect options and value are valid - the visibility css rules
             * are controlled by animation library.
             * If not - we set styles through corvid.
             */
            if (validateEffect({
                    effectName,
                    effectOptions,
                    propertyName: 'show',
                })) {
                const runAnimationOptions = {
                    animationDirection: EFFECTS.SHOW.suffix,
                    effectName,
                    effectOptions: Object.assign(Object.assign({}, ((effectDefaultOptions === null || effectDefaultOptions === void 0 ? void 0 : effectDefaultOptions[effectName]) ||
                        sharedEffectDefaultOptions)), effectOptions),
                };
                await Promise.all([
                    runAnimation(runAnimationOptions),
                    hasPortal ? portal.runAnimation(runAnimationOptions) : undefined,
                ]);
            } else {
                setStyles(styleUtils.getShownStyles());
                if (hasPortal) {
                    portal.setStyles(styleUtils.getShownStyles());
                }
            }
            setState({
                hidden: false
            });
            (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportEnter) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb());
        },
        collapse: async () => {
            var _a;
            setProps({
                collapsed: true
            });
            if (!state.collapsed) {
                setStyles(styleUtils.getCollapsedStyles());
                if (hasPortal) {
                    portal.setStyles(styleUtils.getCollapsedStyles());
                }
                setState({
                    collapsed: true
                });
                if (!state.hidden) {
                    (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportLeave) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb());
                }
            }
            return;
        },
        expand: async () => {
            var _a;
            setProps({
                collapsed: false
            });
            if (state.collapsed) {
                const style = Object.assign(Object.assign({}, styleUtils.getExpandedStyles()), {
                    visibility: state.hidden ? 'hidden' : null
                });
                setStyles(style);
                if (hasPortal) {
                    portal.setStyles(style);
                }
                setState({
                    collapsed: false
                });
                if (!state.hidden) {
                    (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportEnter) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb());
                }
            }
            return;
        },
        get collapsed() {
            return state.collapsed;
        },
        get hidden() {
            return Boolean(state.hidden);
        },
        get isVisible() {
            if (!metaData.isRendered()) {
                return false;
            }
            let parentSdk = getSdkInstance();
            while (parentSdk) {
                if (parentSdk.hidden || parentSdk.collapsed) {
                    return false;
                }
                parentSdk = parentSdk.parent;
            }
            return true;
        },
        get isAnimatable() {
            return true;
        },
    };
};
//# sourceMappingURL=hiddenCollapsedSDKFactory.js.map