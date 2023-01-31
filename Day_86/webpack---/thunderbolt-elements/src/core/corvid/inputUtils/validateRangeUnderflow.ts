import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateRangeUnderflow = (
  props: {
    min?: number | null;
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { min, value } = props;

  if (!min || !isFinite(min) || !value) {
    return validationData;
  }

  return Number(value) >= min
    ? validationData
    : addErrorToValidationDataAndKeepMessage(validationData, 'rangeUnderflow');
};
