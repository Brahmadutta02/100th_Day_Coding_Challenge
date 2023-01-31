import {
    assert
} from '../../assert';
import {
    ValidationResult
} from '../createSchemaValidator';
export function validateFunction(value) {
    if (!assert.isFunction(value)) {
        return ValidationResult.InvalidType;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=function.js.map