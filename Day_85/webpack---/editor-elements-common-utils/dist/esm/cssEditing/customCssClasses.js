const CSS_PREFIX = 'wixui-';
export const customCssClasses = (...classes) => {
    const customClasses = classes.map(className => `${CSS_PREFIX}${className}`);
    return customClasses.join(' ');
};
//# sourceMappingURL=customCssClasses.js.map