import {
  withValidation,
  composeSDKFactories,
  createCompSchemaValidator,
  reportWarning,
  messages,
  labelPropsSDKFactory,
  isNil,
  createRequiredPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  focusPropsSDKFactory,
  createValidationPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  createStylePropsSDKFactory,
  changePropsSDKFactory,
  toJSONBase,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { ComboBoxInputOption } from '@wix/thunderbolt-components';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import {
  ComboBoxInputOptionCssProperties,
  ComboBoxInputOptionCssPropertyValue,
  ComboBoxInputOptionStyle,
  ComboBoxInputOptionWithStyle,
  IComboBoxInputImperativeActions,
  IComboBoxInputOwnSDKFactory,
  IComboBoxInputProps,
  IComboBoxInputSDK,
} from '../ComboBoxInput.types';
import {
  composeSanitizers,
  numberToString,
  emptyStringIfNotString,
  createInputValidator,
  validateRequired,
  composeValidators,
  InputValidator,
} from '../../../core/corvid/inputUtils';
import {
  filterOptionsByQuery,
  isOptionWithSelectedText,
  optionsMapper,
} from '../utils';

const comboBoxInputValidator: InputValidator<
  IComboBoxInputProps,
  IComboBoxInputImperativeActions
> = createInputValidator(
  composeValidators<IComboBoxInputProps>([validateRequired]),
);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory(
  comboBoxInputValidator,
);

const validationPropsSDKFactory = createValidationPropsSDKFactory(
  comboBoxInputValidator,
);

const valueSanitizer = composeSanitizers([
  numberToString,
  emptyStringIfNotString,
]);

const sdkOptionPropertyName = 'selectOption';

export type SdkComboBoxOption = {
  value?: string | null;
  label?: string | null;
};

const isValidOption = (option: SdkComboBoxOption): boolean => {
  const hasSomeValue = !!option.value || !!option.label;
  const isValidEmptyOption = option.value === '' && option.label === '';
  return hasSomeValue || isValidEmptyOption;
};

const throwInvalidOptionsWarnings = (options: Array<SdkComboBoxOption>): void =>
  options.forEach((option, index) => {
    if (!isValidOption(option)) {
      reportWarning(
        messages.invalidOption({
          propertyName: sdkOptionPropertyName,
          wrongValue: option,
          index,
        }),
      );
    }
  });

const isValueInOptions = (
  options: Array<ComboBoxInputOption>,
  value: string,
): boolean => options.some(option => option.value === value);

const emptyStringIfNotAnOption = (
  options: Array<ComboBoxInputOption>,
  value: string,
): string => (isValueInOptions(options, value) ? value : '');

const comboBoxInputCorvidType = 'Dropdown';

const moveSelectedOptionToHeadOfList = (
  options: Array<ComboBoxInputOption>,
  value: string,
): {
  options: Array<ComboBoxInputOption>;
} => {
  const selectedOptionOriginalIndex = options.findIndex(
    option => option.value === value,
  );
  const optionsClone = [...options];

  const [deletedOption] = optionsClone.splice(selectedOptionOriginalIndex, 1);
  optionsClone.unshift(deletedOption);

  return { options: optionsClone };
};

const _ownSDKFactory: IComboBoxInputOwnSDKFactory = api => {
  const {
    props,
    setProps,
    metaData,
    createSdkState,
    sdkData: { isOptionStyleEnabled = false },
  } = api;
  const schemaValidator = createCompSchemaValidator(metaData.role);

  const optionsStyle: {
    [key: string]: ComboBoxInputOptionStyle;
  } = {};

  if (props.options) {
    props.options.forEach(
      (option: ComboBoxInputOption) => (optionsStyle[option.key] = {}),
    );
  }

  const [state, setState] = createSdkState<{
    value?: string | null;
    optionsStyle?: {
      [key: string]: ComboBoxInputOptionStyle;
    };
  }>(isOptionStyleEnabled ? { optionsStyle } : {});

  const getCssProperty = (
    optionKey: string,
    propertyName: ComboBoxInputOptionCssProperties,
  ) => state.optionsStyle && state.optionsStyle[optionKey][propertyName];

  const setCssProperty = (
    options: Array<ComboBoxInputOptionWithStyle>,
    optionKey: string,
    optionIndex: number,
    propertyName: ComboBoxInputOptionCssProperties,
    newPropertyValue: ComboBoxInputOptionCssPropertyValue,
  ) => {
    const newOptionsStyle = state.optionsStyle;

    if (newOptionsStyle) {
      newOptionsStyle[optionKey][propertyName] = newPropertyValue;
      setState({ ...state, optionsStyle: newOptionsStyle });
    }

    const newOptions: Array<ComboBoxInputOptionWithStyle> = [...options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      style: {
        ...newOptions[optionIndex].style,
        [propertyName]: newPropertyValue,
      },
    };
    setProps({ options: newOptions });
  };

  const sdkProps = {
    get options() {
      const { options: compPropsOptions } = props;
      const apiOptions: Array<SdkComboBoxOption> = compPropsOptions
        ? optionsMapper(compPropsOptions)
        : [];

      return isOptionStyleEnabled
        ? apiOptions.map((apiOption, index) => {
            const { key } = compPropsOptions[index];

            return {
              ...apiOption,
              get style() {
                return {
                  get backgroundColor() {
                    return getCssProperty(key, 'backgroundColor');
                  },
                  set backgroundColor(
                    backgroundColor: ComboBoxInputOptionCssPropertyValue,
                  ) {
                    setCssProperty(
                      compPropsOptions,
                      key,
                      index,
                      'backgroundColor',
                      backgroundColor,
                    );
                  },
                  get color() {
                    return getCssProperty(key, 'color');
                  },
                  set color(color: ComboBoxInputOptionCssPropertyValue) {
                    setCssProperty(
                      compPropsOptions,
                      key,
                      index,
                      'color',
                      color,
                    );
                  },
                };
              },
            };
          })
        : apiOptions;
    },
    set options(_options) {
      const options = _options || [];
      throwInvalidOptionsWarnings(options);

      const newOptions = options
        .filter((option: SdkComboBoxOption) => isValidOption(option))
        .map((option: SdkComboBoxOption, index: number) => ({
          key: `${index}`,
          value: option.value || '',
          text: option.label || '',
        }));

      const commonProps = { options: newOptions };
      const intermediateValue = state.value;
      const supportSettingValueBeforeOptionsFlow =
        intermediateValue && isValueInOptions(newOptions, intermediateValue);

      if (supportSettingValueBeforeOptionsFlow) {
        setProps({
          ...commonProps,
          value: intermediateValue,
        });

        setState({ value: null });
      } else {
        setProps(commonProps);
      }

      comboBoxInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: false,
      });
    },
    get placeholder() {
      return props.placeholder.value || '';
    },
    set placeholder(_placeholder) {
      const placeholder = _placeholder || '';
      setProps({
        placeholder: {
          value: placeholder,
          text: placeholder,
        },
      });
    },
    get selectedIndex() {
      const selectedIndex = props.options.findIndex(
        (option: ComboBoxInputOption) => option.value === props.value,
      );
      return selectedIndex !== -1 ? selectedIndex : undefined;
    },
    set selectedIndex(index) {
      const isValid = schemaValidator(
        index,
        {
          type: ['integer', 'nil'],
          minimum: 0,
          maximum: props.options.length - 1,
        },
        'selectedIndex',
      );
      if (!isValid) {
        return;
      }
      const newSelectedValue = isNil(index) ? '' : props.options[index].value;

      const additionalProps = isOptionWithSelectedText(
        props.options,
        newSelectedValue,
      )
        ? moveSelectedOptionToHeadOfList(props.options, newSelectedValue)
        : {};

      setProps({
        value: newSelectedValue,
        ...additionalProps,
      });

      comboBoxInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get value() {
      const isCurrentValueInOptions = isValueInOptions(
        props.options,
        props.value,
      );
      return isCurrentValueInOptions ? props.value : '';
    },
    set value(value) {
      const sanitizedValue = valueSanitizer(value);

      const isValid = schemaValidator(
        sanitizedValue,
        { type: ['string'] },
        'value',
      );
      if (!isValid) {
        return;
      }
      setState({ value: sanitizedValue });
      const newValue = emptyStringIfNotAnOption(props.options, sanitizedValue);

      const additionalProps = isOptionWithSelectedText(props.options, newValue)
        ? moveSelectedOptionToHeadOfList(props.options, value)
        : {};

      setProps({ value: newValue, ...additionalProps });

      comboBoxInputValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get type() {
      return `$w.${comboBoxInputCorvidType}`;
    },
    get filterQuery() {
      return props.filterQuery || '';
    },
    set filterQuery(filterQuery: string) {
      setProps({ filterQuery: filterQuery || '' });
    },
    get filteredOptions() {
      const { options = [], filterQuery } = props;
      return filterQuery
        ? optionsMapper(filterOptionsByQuery(filterQuery, options))
        : optionsMapper(options);
    },
    get opened() {
      return props.opened || false;
    },
    set opened(opened: boolean) {
      setProps({ opened: Boolean(opened) });
    },
    toJSON() {
      const { required } = props;
      const { value, options, placeholder, selectedIndex } = sdkProps;
      return {
        ...toJSONBase(metaData),
        type: `$w.${comboBoxInputCorvidType}`,
        required,
        value,
        options,
        placeholder,
        selectedIndex,
      };
    },
  };

  return sdkProps;
};

const ownSDKFactory = withValidation(_ownSDKFactory, {
  type: ['object'],
  properties: {
    options: {
      type: ['array', 'nil'],
      warnIfNil: true,
      items: {
        type: ['object'],
        properties: {
          value: {
            type: ['string', 'nil'],
            minLength: 0,
            maxLength: 400,
          },
          label: {
            type: ['string', 'nil'],
            minLength: 0,
            maxLength: 400,
          },
        },
      },
    },
    placeholder: {
      type: ['string', 'nil'],
      warnIfNil: true,
    },
    selectedIndex: {
      type: ['integer', 'nil'],
    },
    filterQuery: {
      type: ['string'],
    },
    opened: {
      type: ['boolean'],
    },
  },
});

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
  TextColor: true,
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaControls: true,
  enableAriaOwns: true,
  enableAriaErrorMessage: true,
  enableTabIndex: true,
});

export const sdk = composeSDKFactories<
  IComboBoxInputProps,
  IComboBoxInputSDK,
  any
>(
  elementPropsSDKFactory,
  requiredPropsSDKFactory,
  validationPropsSDKFactory,
  focusPropsSDKFactory,
  changePropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
  labelPropsSDKFactory,
  accessibilityPropsSDKFactory,
  ownSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
