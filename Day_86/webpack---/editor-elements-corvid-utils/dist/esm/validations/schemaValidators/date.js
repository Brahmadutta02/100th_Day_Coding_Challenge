import {
    assert
} from '../../assert';
import {
    ValidationResult
} from '../createSchemaValidator';
export function validateDate(value) {
    if (!assert.isDate(value)) {
        return ValidationResult.InvalidType;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=date.js.map