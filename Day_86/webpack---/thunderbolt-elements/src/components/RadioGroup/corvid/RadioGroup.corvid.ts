import {
  withValidation,
  composeSDKFactories,
  assert,
  createCompSchemaValidator,
  reportWarning,
  messages,
  labelPropsSDKFactory,
  createValidationPropsSDKFactory,
  createRequiredPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  changePropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  IRadioGroupProps,
  IRadioGroupOwnSDKFactory,
  IRadioGroupSDK,
  IRadioGroupImperativeActions,
  RadioGroupOption,
} from '../RadioGroup.types';
import {
  composeSanitizers,
  numberToString,
  emptyStringIfNotString,
  createInputValidator,
  composeValidators,
  InputValidator,
  validateRequired,
} from '../../../core/corvid/inputUtils';

const radioGroupValidator: InputValidator<
  IRadioGroupProps,
  IRadioGroupImperativeActions
> = createInputValidator(
  composeValidators<IRadioGroupProps>([validateRequired]),
);

const _ownSDKFactory: IRadioGroupOwnSDKFactory = api => {
  const { setProps, props, metaData } = api;

  const isValueInOptions = (_value: string) =>
    !!props.options.find(({ value }: { value: string }) => value === _value);

  const sdkProps = {
    get options() {
      return props.options
        ? props.options.map(
            ({ label, value }: { label: string; value: string }) => ({
              label,
              value,
            }),
          )
        : props.options;
    },
    set options(_options) {
      const options = (_options || [])
        .filter((option: RadioGroupOption, index: number) => {
          const { value, label } = option;
          const omitOption =
            (assert.isNil(value) && !label) || (assert.isNil(label) && !value);
          if (omitOption) {
            reportWarning(
              messages.invalidOption({
                propertyName: 'RadioButton',
                index,
                wrongValue: option,
              }),
            );
          }
          return !omitOption;
        })
        .map(({ label, value }: { label: string; value: string }) => ({
          label,
          value,
        }));

      setProps({ options });

      radioGroupValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: false,
      });
    },
    get value() {
      return isValueInOptions(props.value) ? props.value : '';
    },
    set value(_value) {
      const sanitizedValue = valueSanitizer(_value);

      const actualValue = props.options.find(
        ({ value }: { value: string }) => value === sanitizedValue,
      )
        ? sanitizedValue
        : '';

      setProps({ value: actualValue });

      radioGroupValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get selectedIndex() {
      const index = (props.options || []).findIndex(
        ({ value }: { value: string }) => value === props.value,
      );
      return index < 0 ? undefined : index;
    },
    set selectedIndex(index) {
      if (assert.isNil(index)) {
        setProps({ value: '' });
      } else {
        setProps({ value: props.options[index].value });
      }

      radioGroupValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get type() {
      return '$w.RadioButtonGroup';
    },
    toJSON() {
      const { required } = props;
      const { value, options, selectedIndex } = sdkProps;
      return {
        ...toJSONBase(metaData),
        type: '$w.RadioButtonGroup',
        required,
        value,
        options,
        selectedIndex,
      };
    },
  };

  return sdkProps;
};

const ownSDKFactory = withValidation(
  _ownSDKFactory,
  {
    type: ['object'],
    properties: {
      options: {
        type: ['array', 'nil'],
        name: 'RadioButton',
        items: {
          type: ['object'],
          properties: {
            value: {
              type: ['string', 'nil'],
              maxLength: 400,
              minLength: 0,
            },
            label: {
              type: ['string', 'nil'],
              maxLength: 400,
              minLength: 0,
            },
          },
        },
      },
      selectedIndex: {
        type: ['integer', 'nil'],
      },
    },
  },
  {
    selectedIndex: [
      (index, { props, metaData }) => {
        const schemaValidator = createCompSchemaValidator(metaData.role);

        if (assert.isNil(index)) {
          return true;
        }

        return schemaValidator(
          index,
          {
            type: ['integer'],
            minimum: 0,
            maximum: props.options.length - 1,
          },
          'selectedIndex',
        );
      },
    ],
  },
);

const validationPropsSDKFactory =
  createValidationPropsSDKFactory(radioGroupValidator);

const requiredPropsSDKFactory =
  createRequiredPropsSDKFactory(radioGroupValidator);

const valueSanitizer = composeSanitizers([
  numberToString,
  emptyStringIfNotString,
]);

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
  TextColor: true,
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<IRadioGroupProps, IRadioGroupSDK, any>(
  elementPropsSDKFactory,
  disablePropsSDKFactory,
  focusPropsSDKFactory,
  clickPropsSDKFactory,
  requiredPropsSDKFactory,
  validationPropsSDKFactory,
  changePropsSDKFactory,
  stylePropsSDKFactory,
  labelPropsSDKFactory,
  ownSDKFactory,
);

export default createComponentSDKModel(sdk);
