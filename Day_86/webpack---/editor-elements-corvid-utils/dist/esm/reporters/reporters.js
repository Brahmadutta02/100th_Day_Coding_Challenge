export const WIX_SDK_ERROR_TEXT = 'Wix code SDK error:';
export const WIX_SDK_WARNING_TEXT = 'Wix code SDK warning:';
export const WIX_SDK_MESSAGE_TEXT = 'Wix code SDK message:';
export const reportError = (message) => {
    console.error(`${WIX_SDK_ERROR_TEXT} ${message}`);
};
export const reportWarning = (message) => {
    console.warn(`${WIX_SDK_WARNING_TEXT} ${message}`);
};
export const reportMessage = (message) => {
    console.log(`${WIX_SDK_MESSAGE_TEXT} ${message}`);
};
//# sourceMappingURL=reporters.js.map