import { assert } from '@wix/editor-elements-corvid-utils';
import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validateEmail = (
  props: {
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { value } = props;

  if (!value) {
    return validationData;
  }

  return assert.isEmail(value)
    ? validationData
    : addErrorToValidationDataAndKeepMessage(validationData, 'typeMismatch');
};
