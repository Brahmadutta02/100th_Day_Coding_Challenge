import {
    assert
} from '../../assert';
import {
    ValidationResult
} from '../createSchemaValidator';
export function validateBoolean(value) {
    if (!assert.isBoolean(value)) {
        return ValidationResult.InvalidType;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=boolean.js.map