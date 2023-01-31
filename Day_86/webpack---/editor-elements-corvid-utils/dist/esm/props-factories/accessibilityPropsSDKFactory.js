import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    createAriaLabelSDK,
    createAtomicSDK,
    createBusySDK,
    createCurrentSDK,
    createDescribedBySDK,
    createErrorMessageSDK,
    createExpandedSDK,
    createLabelledBySDK,
    legacyAriaLabelSDKFactory,
    createLiveSDK,
    createOwnsSDK,
    createRelevantSDK,
    createRoleSDK,
    screenReaderSDKFactory,
    createTabIndexSDK,
    createControlsSDK,
    createRoleDescriptionSDK,
    createAriaHiddenSDK,
    createAriaPressedSDK,
    createAriaHaspopupSDK,
} from './accessibilitySDKFactories';
const ariaFactoryMap = {
    enableAriaLabel: createAriaLabelSDK,
    enableAriaDescribedBy: createDescribedBySDK,
    enableAriaLabelledBy: createLabelledBySDK,
    enableAriaAtomic: createAtomicSDK,
    enableAriaBusy: createBusySDK,
    enableAriaCurrent: createCurrentSDK,
    enableAriaExpanded: createExpandedSDK,
    enableAriaLive: createLiveSDK,
    enableAriaOwns: createOwnsSDK,
    enableAriaControls: createControlsSDK,
    enableAriaRoleDescription: createRoleDescriptionSDK,
    enableAriaRelevant: createRelevantSDK,
    enableAriaErrorMessage: createErrorMessageSDK,
    enableAriaHidden: createAriaHiddenSDK,
    enableAriaPressed: createAriaPressedSDK,
    enableAriaHaspopup: createAriaHaspopupSDK,
};
const accessibilityFactoryMap = {
    enableLegacyAriaLabel: legacyAriaLabelSDKFactory,
    enableScreenReader: screenReaderSDKFactory,
    enableRole: createRoleSDK,
    enableTabIndex: createTabIndexSDK,
};
const createAriaAttributesSDKFactory = (ariaAttributeOptions) => {
    const sdkFactories = [];
    Object.entries(ariaAttributeOptions).forEach(([option, enabled]) => enabled &&
        ariaFactoryMap[option] &&
        sdkFactories.push(ariaFactoryMap[option]));
    const ariaAttributesSDKFactory = api => ({
        ariaAttributes: composeSDKFactories(...sdkFactories)(api),
    });
    return ariaAttributesSDKFactory;
};
export const createAccessibilityPropSDKFactory = ({
    enableLegacyAriaLabel = false,
    enableAriaLabel = true,
    enableAriaDescribedBy = true,
    enableAriaLabelledBy = true,
    enableAriaAtomic = false,
    enableAriaBusy = false,
    enableAriaHidden = false,
    enableAriaPressed = false,
    enableAriaHaspopup = false,
    enableAriaCurrent = false,
    enableAriaExpanded = false,
    enableAriaLive = false,
    enableAriaOwns = false,
    enableAriaControls = false,
    enableAriaRoleDescription = false,
    enableAriaRelevant = false,
    enableRole = false,
    enableTabIndex = false,
    enableAriaErrorMessage = false,
    enableScreenReader = false,
} = {}) => api => {
    const sdkFactories = [];
    const ariaAttributesOptions = {
        enableAriaLabel,
        enableAriaDescribedBy,
        enableAriaLabelledBy,
        enableAriaAtomic,
        enableAriaBusy,
        enableAriaCurrent,
        enableAriaExpanded,
        enableAriaLive,
        enableAriaOwns,
        enableAriaControls,
        enableAriaRoleDescription,
        enableAriaRelevant,
        enableAriaErrorMessage,
        enableAriaHidden,
        enableAriaPressed,
        enableAriaHaspopup,
    };
    const otherAccessibilityOptions = {
        enableLegacyAriaLabel,
        enableScreenReader,
        enableRole,
        enableTabIndex,
    };
    const enableAriaAttributes = Object.values(ariaAttributesOptions).some(optionEnabled => optionEnabled);
    if (enableAriaAttributes) {
        const ariaAttributesSDKFactory = createAriaAttributesSDKFactory(ariaAttributesOptions);
        sdkFactories.push(ariaAttributesSDKFactory);
    }
    Object.entries(otherAccessibilityOptions).forEach(([option, enabled]) => enabled &&
        accessibilityFactoryMap[option] &&
        sdkFactories.push(accessibilityFactoryMap[option]));
    const accessibilitySdkFactory = composeSDKFactories(...sdkFactories);
    return {
        accessibility: accessibilitySdkFactory(api)
    };
};
//# sourceMappingURL=accessibilityPropsSDKFactory.js.map