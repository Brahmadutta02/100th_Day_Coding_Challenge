import { assert } from '@wix/editor-elements-corvid-utils';
import {
  ValidateFunction,
  CustomValidator,
  ValidationData,
  ValidityKey,
  ValidityKeyWithMessage,
  ValueValidator,
  HtmlValidationMessageOverrideObject,
} from './inputValidationTypes';

const INVALID_MESSAGES: {
  [key in ValidityKeyWithMessage]: string | ((param: string) => string);
} = {
  valueMissing: 'value missing',
  patternMismatch: 'pattern mismatch',
  rangeOverflow: 'range overflow',
  rangeUnderflow: 'range underflow',
  stepMismatch: 'step mismatch',
  typeMismatch: 'type mismatch',
  fileNotUploaded: 'file not uploaded',
  fileTypeNotAllowed: (extension: string) =>
    `${extension} files are not supported.`,
  fileSizeExceedsLimit: (maxFileSize: string) =>
    `This file is too big. Select a smaller file (${maxFileSize} max).`,
  tooLong: 'too long',
  tooShort: 'too short',
  exceedsFilesLimit: 'number of files selected exceeds the limit',
  invalidTime: 'invalid time',
  invalidDate: 'invalid date',
};

export const INITIAL_VALIDATION_DATA: ValidationData = {
  type: 'General',
  validity: {
    badInput: false,
    customError: false,
    fileNotUploaded: false,
    fileTypeNotAllowed: false,
    fileSizeExceedsLimit: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    exceedsFilesLimit: false,
    valid: true,
    invalidTime: false,
    invalidDate: false,
  },
  validationMessage: '',
  htmlValidationMessageOverride: { key: '' },
};

export const getValidationMessage = <T extends ValidityKeyWithMessage>(
  validityKey: T,
  param?: string,
): string => {
  const invalidMessage = INVALID_MESSAGES[validityKey] as any;
  return assert.isString(invalidMessage)
    ? invalidMessage
    : invalidMessage(param);
};

export const getCustomValidityMessage = (
  validationData: ValidationData,
): string => {
  const hasCustomError = !!validationData.validity.customError;

  return hasCustomError ? validationData.validationMessage : '';
};

export const addErrorToValidationData = <
  TValidationData extends ValidationData = ValidationData,
>(
  validationData: TValidationData,
  validityKey: ValidityKey,
  validationMessage: string,
): TValidationData => ({
  ...validationData,
  validity: {
    ...validationData.validity,
    [validityKey]: true,
    valid: false,
  },
  validationMessage,
});

export const addCustomValidityToValidationData = <
  TValidationData extends ValidationData = ValidationData,
>(
  validationData: TValidationData,
  customValidityMessage: string,
) =>
  addErrorToValidationData(
    validationData,
    'customError',
    customValidityMessage || '',
  );

export const addErrorToValidationDataAndKeepMessage = <
  TValidationData extends ValidationData = ValidationData,
>(
  validationData: TValidationData,
  validityKey: ValidityKeyWithMessage,
  validationMessage?: string,
) => {
  const newValidationMessage =
    validationData.validationMessage ||
    validationMessage ||
    getValidationMessage(validityKey);

  return addErrorToValidationData(
    validationData,
    validityKey,
    newValidationMessage,
  );
};

export const addErrorToValidationDataAndKeepHtmlMessage = <
  TValidationData extends ValidationData = ValidationData,
>(
  validationData: TValidationData,
  validityKey: ValidityKeyWithMessage,
  htmlValidationMessageOverride: HtmlValidationMessageOverrideObject,
) => {
  const newHtmlMessage = validationData.htmlValidationMessageOverride.key
    ? validationData.htmlValidationMessageOverride
    : htmlValidationMessageOverride;

  return {
    ...addErrorToValidationDataAndKeepMessage(validationData, validityKey),
    htmlValidationMessageOverride: newHtmlMessage,
  };
};

export const checkCustomValidity = <TProps>(
  customValidator: CustomValidator,
  props: any,
  compValueGetter?: (props: TProps) => any,
) => {
  let customValidityMessage = '';

  const reject = (message: string) => {
    customValidityMessage = message;
  };

  const userValue = compValueGetter ? compValueGetter(props) : props.value;

  if (customValidator) {
    customValidator(userValue, reject);
  }

  return customValidityMessage;
};

export const composeValidators =
  <TProps>(
    validators: Array<ValueValidator<TProps>>,
  ): ValidateFunction<TProps> =>
  (props, api) => {
    return validators.reduce(
      (validationData: ValidationData, validator: ValueValidator<TProps>) => {
        return validator(props, validationData, api);
      },
      INITIAL_VALIDATION_DATA,
    );
  };
