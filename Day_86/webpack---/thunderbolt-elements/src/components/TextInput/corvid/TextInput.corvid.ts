import {
  withValidation,
  composeSDKFactories,
  assert,
  createCompSchemaValidator,
  labelPropsSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
  readOnlyPropsSDKFactory,
  createValidationPropsSDKFactory,
  createRequiredPropsSDKFactory,
  createValuePropsSdkFactory,
  textInputPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  ITextInputProps,
  ITextInputOwnSDKFactory,
  ITextInputSDK,
  ITextInputImperativeActions,
  TextInputType,
} from '../TextInput.types';
import {
  createInputValidator,
  composeSanitizers,
  numberToString,
  emptyStringIfNotString,
  removeLineBreaks,
  forceMaxLength,
  removeLeadingAndTrailingWhitespace,
  validFloatingPointNumber,
  normalizePrecision,
  Sanitizer,
  InputValidator,
} from '../../../core/corvid/inputUtils';
import { validateTextInput } from './utils/validateTextInput';

const textInputValidator: InputValidator<
  ITextInputProps,
  ITextInputImperativeActions
> = createInputValidator(validateTextInput);

const validationPropsSDKFactory = createValidationPropsSDKFactory<
  ITextInputProps,
  ITextInputImperativeActions
>(textInputValidator);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory<
  ITextInputProps,
  ITextInputImperativeActions
>(textInputValidator);

const valuePropsSDKFactory = createValuePropsSdkFactory<
  ITextInputProps,
  ITextInputImperativeActions
>(
  (value, api) => valueSanitizers(api.props)(value),
  { type: ['string'] },
  textInputValidator,
);

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
  TextColor: true,
});

const _ownSDKFactory: ITextInputOwnSDKFactory = api => {
  const { setProps, props, metaData } = api;

  return {
    get max() {
      return props.max;
    },
    set max(value) {
      if (value === undefined || value === null) {
        setProps({ max: null });
      }

      setProps({ max: value });

      textInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get min() {
      return props.min;
    },
    set min(value) {
      if (value === undefined || value === null) {
        setProps({ min: null });
      }

      setProps({ min: value });

      textInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get inputType() {
      return props.inputType;
    },
    set inputType(value) {
      setProps({ inputType: value });

      textInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get prefix() {
      return props.prefix || '';
    },
    set prefix(value) {
      const prefix = value || '';
      setProps({ prefix });
    },
    get numberSpinnerHidden() {
      return typeof props.numberSpinnerHidden !== 'undefined'
        ? props.numberSpinnerHidden
        : false;
    },
    hideNumberSpinner() {
      setProps({ numberSpinnerHidden: true });
      return Promise.resolve();
    },
    showNumberSpinner() {
      setProps({ numberSpinnerHidden: false });
      return Promise.resolve();
    },

    toJSON() {
      const {
        readOnly,
        required,
        value,
        max,
        min,
        inputType,
        isValid,
        prefix,
      } = props;
      return {
        ...toJSONBase(metaData),
        readOnly,
        required,
        value,
        max,
        min,
        inputType,
        prefix,
        valid: isValid,
      };
    },
  };
};

const ownSDKFactory = withValidation(
  _ownSDKFactory,
  {
    type: ['object'],
    properties: {
      min: { type: ['integer', 'nil'] },
      max: { type: ['integer', 'nil'] },
      inputType: {
        type: ['string'],
        enum: ['text', 'email', 'number', 'password', 'tel', 'url'],
      },
      prefix: {
        type: ['string', 'nil'],
        warnIfNil: true,
      },
    },
  },
  {
    max: [
      (value, api) => {
        if (
          !assert.isNil(value) &&
          assert.isInteger(api.props.min) &&
          !createCompSchemaValidator(api.metaData.role)(
            value,
            { type: ['integer'], minimum: api.props.min },
            'max',
          )
        ) {
          return false;
        }

        return true;
      },
    ],
    min: [
      (value, api) => {
        if (
          !assert.isNil(value) &&
          assert.isInteger(api.props.max) &&
          !createCompSchemaValidator(api.metaData.role)(
            value,
            { type: ['integer'], maximum: api.props.max },
            'min',
          )
        ) {
          return false;
        }
        return true;
      },
    ],
  },
);

const valueSanitizers = ({ inputType, maxLength, step }: ITextInputProps) => {
  const sanitizers: { [key in TextInputType]: Sanitizer } = {
    text: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
      forceMaxLength(maxLength),
    ]),
    password: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
      forceMaxLength(maxLength),
    ]),
    number: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      validFloatingPointNumber,
      normalizePrecision(step),
    ]),
    email: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
      removeLeadingAndTrailingWhitespace,
    ]),
    url: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
      removeLeadingAndTrailingWhitespace,
    ]),
    tel: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
    ]),
    search: composeSanitizers([
      numberToString,
      emptyStringIfNotString,
      removeLineBreaks,
      forceMaxLength(maxLength),
    ]),
  };
  return sanitizers[inputType];
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaExpanded: true,
  enableAriaOwns: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableAriaHaspopup: true,
  enableAriaErrorMessage: true,
  enableTabIndex: true,
});

export const sdk = composeSDKFactories<ITextInputProps, ITextInputSDK, any>(
  elementPropsSDKFactory,
  disablePropsSDKFactory,
  textInputPropsSDKFactory,
  focusPropsSDKFactory,
  readOnlyPropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
  requiredPropsSDKFactory,
  valuePropsSDKFactory,
  validationPropsSDKFactory,
  accessibilityPropsSDKFactory,
  labelPropsSDKFactory,
  ownSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
