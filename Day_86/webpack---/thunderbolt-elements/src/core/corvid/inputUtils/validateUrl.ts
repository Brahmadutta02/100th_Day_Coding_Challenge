import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepMessage } from './validityUtils';

const validUrlRegExp =
  /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/;

const isValidUrl = (value: string) => validUrlRegExp.test(value);

export const validateUrl = (
  props: {
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { value } = props;

  if (!value) {
    return validationData;
  }

  return isValidUrl(value)
    ? validationData
    : addErrorToValidationDataAndKeepMessage(validationData, 'typeMismatch');
};
