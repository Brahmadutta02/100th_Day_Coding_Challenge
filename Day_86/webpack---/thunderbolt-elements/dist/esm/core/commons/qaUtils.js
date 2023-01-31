export const getQaDataAttributes = (isQaMode, fullNameCompType) => isQaMode ?
    {
        'data-comp': fullNameCompType,
        'data-aid': fullNameCompType,
    } :
    {};
//# sourceMappingURL=qaUtils.js.map