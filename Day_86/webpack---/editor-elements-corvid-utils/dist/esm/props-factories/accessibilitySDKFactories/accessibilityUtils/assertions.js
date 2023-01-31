export const isTextElement = (sdkInstance) => isElement(sdkInstance) &&
    (sdkInstance.type === '$w.Text' || sdkInstance.type === '$w.CollapsibleText');
export const isElement = (sdkInstance) => Boolean(sdkInstance.id && sdkInstance.uniqueId && sdkInstance.type);
export const isEmptyValue = (value) => value === undefined || value === null;
//# sourceMappingURL=assertions.js.map