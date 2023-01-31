import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateRequiredOptions = (
  props: {
    required: boolean;
    options: Array<{ checked: boolean }>;
  },
  validationData: ValidationData,
): ValidationData => {
  const isRequired = props.required || false;

  if (
    !isRequired ||
    (props.options &&
      (!props.options.length || props.options.find(option => option.checked)))
  ) {
    return validationData;
  }

  return addErrorToValidationDataAndKeepMessage(validationData, 'valueMissing');
};
