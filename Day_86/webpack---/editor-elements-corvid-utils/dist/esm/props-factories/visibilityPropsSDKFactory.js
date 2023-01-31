import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    createHiddenCollapsedSDKFactory
} from './hiddenCollapsedSDKFactory';
import {
    createViewportPropsSDKFactory,
} from './viewportPropsSDKFactory';
const visibilityPropsSDKFactory = (api, hasPortal = false) => {
    const [state, setState] = api.createSdkState({
        onViewportEnter: [],
        onViewportLeave: [],
    }, 'viewport');
    const registerCallback = (type, callback) => {
        setState({
            [type]: [...state[type], callback]
        });
    };
    const hiddenCollapsedSDKFactory = createHiddenCollapsedSDKFactory({
        viewportState: state,
        hasPortal,
    });
    const viewportPropsSDKFactory = createViewportPropsSDKFactory(registerCallback);
    return composeSDKFactories(hiddenCollapsedSDKFactory, viewportPropsSDKFactory)(api);
};
export const createVisibilityPropsSDKFactory = (hasPortal) => {
    return (api) => visibilityPropsSDKFactory(api, hasPortal);
};
//# sourceMappingURL=visibilityPropsSDKFactory.js.map