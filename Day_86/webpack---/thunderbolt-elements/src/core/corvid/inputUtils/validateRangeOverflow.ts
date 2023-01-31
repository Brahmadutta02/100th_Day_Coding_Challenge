import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateRangeOverflow = (
  props: {
    max?: number | null;
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { max, value } = props;
  if (!max || !isFinite(max) || !value) {
    return validationData;
  }

  return Number(value) <= max
    ? validationData
    : addErrorToValidationDataAndKeepMessage(validationData, 'rangeOverflow');
};
