import {
    assert
} from '../../../assert';
export function validatePixel(value) {
    if (assert.isString(value)) {
        const endsWithPx = value.endsWith('px');
        const integerToValidate = value.slice(0, value.length - 2);
        const containsOnlyNumbers = /^\d*$/.test(integerToValidate);
        return endsWithPx && containsOnlyNumbers && parseInt(integerToValidate, 10);
    }
    return false;
}
//# sourceMappingURL=unitValidations.js.map