import { reportWarning } from '@wix/editor-elements-corvid-utils';
import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

export const validatePattern = (
  props: {
    pattern?: string;
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { pattern, value } = props;

  if (!pattern || !value) {
    return validationData;
  }

  let regExp;
  try {
    regExp = new RegExp(`^(?:${pattern})$`);
  } catch (e) {
    reportWarning(`invalid regex pattern '${pattern}'`);
    return validationData;
  }

  return regExp.test(value)
    ? validationData
    : addErrorToValidationDataAndKeepMessage(validationData, 'patternMismatch');
};
