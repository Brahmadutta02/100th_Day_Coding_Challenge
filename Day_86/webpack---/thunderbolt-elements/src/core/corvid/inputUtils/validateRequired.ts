import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateRequired = (
  props: {
    required: boolean;
    value?: Date | number | string | null;
  },
  validationData: ValidationData,
): ValidationData => {
  const isRequired = props.required || false;

  if (!isRequired || props.value) {
    return validationData;
  }

  return addErrorToValidationDataAndKeepMessage(validationData, 'valueMissing');
};
