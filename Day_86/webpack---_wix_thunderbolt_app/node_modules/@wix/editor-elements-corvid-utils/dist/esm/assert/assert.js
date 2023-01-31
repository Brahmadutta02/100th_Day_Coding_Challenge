const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const urlRegExp = /^(?:(?:https?:)\/\/)(?:(?:[\u0400-\uA69F\w][\u0400-\uA69F\w-]*)?[\u0400-\uA69F\w]\.)+(?:[\u0400-\uA69Fa-z]+|\d{1,3})(?::[\d]{1,5})?(?:[/?#].*)?$/i;
const wixSVGShapeRegExp = /^wix:vector:\/\/v1\/svgshape\.v[12]/;
const wixMediaRegExp = /^wix:vector:\/\/v1\/[0-9|a-z|_]+.svg/;
export function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
export function isString(value) {
    return typeof value === 'string';
}
export function isBoolean(value) {
    return value === true || value === false;
}
export function isDate(value) {
    return value instanceof Date && !Number.isNaN(value.getTime());
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isObject(value) {
    return typeof value === 'object' && value !== null && !isArray(value);
}
export function isInteger(value) {
    return Number.isInteger(value);
}
export function isNil(value) {
    return value === null || value === undefined;
}
export function isIn(value, arr) {
    return arr.includes(value);
}
export function isAbove(value, limit) {
    return value > limit;
}
export function isBelow(value, limit) {
    return value < limit;
}
export function isEmail(value) {
    return emailRegExp.test(value);
}
export function isUrl(value) {
    return urlRegExp.test(value);
}
export function isInlineSvg(maybeSvg) {
    return maybeSvg.includes('<svg');
}
export function isWixSVGShape(maybeShape) {
    return wixSVGShapeRegExp.test(maybeShape);
}
export function isWixMediaUrl(maybeSvg) {
    return wixMediaRegExp.test(maybeSvg);
}
export function isSVG(value) {
    return Boolean(value &&
        (isWixMediaUrl(value) ||
            isUrl(value) ||
            isInlineSvg(value) ||
            isWixSVGShape(value)));
}
export function is(value, predicates) {
    return predicates.every(p => p(value));
}
//# sourceMappingURL=assert.js.map