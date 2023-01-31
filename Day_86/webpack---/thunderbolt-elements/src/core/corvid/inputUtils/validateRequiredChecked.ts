import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateRequiredChecked = (
  props: {
    required: boolean;
    checked: boolean;
  },
  validationData: ValidationData,
): ValidationData => {
  const isRequired = props.required || false;

  if (!isRequired || props.checked) {
    return validationData;
  }

  return addErrorToValidationDataAndKeepMessage(validationData, 'valueMissing');
};
