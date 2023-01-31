import {
    assert
} from '../../assert';
import {
    ValidationResult
} from '../createSchemaValidator';
export function validateNil(value) {
    if (!assert.isNil(value)) {
        return ValidationResult.InvalidType;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=nil.js.map