import { TextInputType } from '@wix/thunderbolt-components-native/dist/components/TextInput/types';
import { ValidateFunction } from '../../../../core/corvid/inputUtils/inputValidationTypes';
import { ITextInputProps } from '../../TextInput.types';
import {
  composeValidators,
  validateRangeOverflow,
  validateStepMismatch,
  validateUrl,
  validateRequired,
  validatePattern,
  validateEmail,
  validateRangeUnderflow,
  validatePhoneFormat,
} from '../../../../core/corvid/inputUtils';

const validateTextInputByType: {
  [key in TextInputType]: ValidateFunction<ITextInputProps>;
} = {
  text: composeValidators<ITextInputProps>([validateRequired, validatePattern]),
  password: composeValidators<ITextInputProps>([
    validateRequired,
    validatePattern,
  ]),
  number: composeValidators<ITextInputProps>([
    validateRequired,
    validateRangeUnderflow,
    validateRangeOverflow,
    validateStepMismatch,
  ]),
  email: composeValidators<ITextInputProps>([
    validateRequired,
    validateEmail,
    validatePattern,
  ]),
  url: composeValidators<ITextInputProps>([
    validateRequired,
    validateUrl,
    validatePattern,
  ]),
  tel: composeValidators<ITextInputProps>([
    validateRequired,
    validatePattern,
    validatePhoneFormat,
  ]),
  search: composeValidators<ITextInputProps>([
    validateRequired,
    validatePattern,
  ]),
};

export const validateTextInput: ValidateFunction<ITextInputProps> = (
  props,
  api,
) => {
  return validateTextInputByType[props.inputType](props, api);
};
