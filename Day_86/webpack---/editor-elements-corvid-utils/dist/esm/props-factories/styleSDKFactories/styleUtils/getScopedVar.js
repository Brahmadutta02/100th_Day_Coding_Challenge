export const getScopedVar = ({
    name,
    prefix,
}) => {
    return prefix ? `--${prefix}-corvid-${name}` : `--corvid-${name}`;
};
//# sourceMappingURL=getScopedVar.js.map