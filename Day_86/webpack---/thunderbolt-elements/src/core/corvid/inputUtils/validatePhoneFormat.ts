import {
  HtmlValidationMessageOverrideObject,
  ValidationData,
} from './inputValidationTypes';
import { addErrorToValidationDataAndKeepHtmlMessage } from './validityUtils';

export const DEFAULT_PHONE_PATTERN =
  '^[+]?([(][0-9]{1,3}[)][-]?)?([0-9][-]?){3,16}[0-9]$';

export const WIX_FORMS_COMPLEX_PHONE_DEFAULT_PHONE_PATTERN =
  '^([(][0-9]{1,3}[)][-]?)?([0-9][-]?){3,16}[0-9]$';

export const validatePhoneFormat = (
  props: {
    pattern?: string;
    phoneFormat?: string;
    value: string;
  },
  validationData: ValidationData,
): ValidationData => {
  const { value, phoneFormat, pattern } = props;

  if (!value) {
    return validationData;
  }

  if (pattern === DEFAULT_PHONE_PATTERN && !new RegExp(pattern).test(value)) {
    return addErrorToValidationDataAndKeepHtmlMessage(
      validationData,
      'patternMismatch',
      {
        key: 'PHONE_FORMAT_DEFAULT_VALIDATION_ERROR',
      },
    );
  }

  if (
    pattern === WIX_FORMS_COMPLEX_PHONE_DEFAULT_PHONE_PATTERN &&
    !new RegExp(pattern).test(value)
  ) {
    return addErrorToValidationDataAndKeepHtmlMessage(
      validationData,
      'patternMismatch',
      {
        key: 'PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR',
      },
    );
  }

  const phoneFormatWithoutSpacesLength = phoneFormat
    ? phoneFormat.replace(/-/g, '').length
    : 0;

  if (
    !phoneFormat ||
    (phoneFormat && value.length === phoneFormatWithoutSpacesLength)
  ) {
    return validationData;
  }

  let validationKey: 'tooShort' | 'tooLong';
  const htmlValidationMessageOverride: HtmlValidationMessageOverrideObject = {
    key: 'PHONE_FORMAT_LENGTH_VALIDATION_ERROR',
  };

  if (value.length < phoneFormatWithoutSpacesLength) {
    validationKey = 'tooShort';
  } else {
    validationKey = 'tooLong';
  }

  return addErrorToValidationDataAndKeepHtmlMessage(
    validationData,
    validationKey,
    htmlValidationMessageOverride,
  );
};
