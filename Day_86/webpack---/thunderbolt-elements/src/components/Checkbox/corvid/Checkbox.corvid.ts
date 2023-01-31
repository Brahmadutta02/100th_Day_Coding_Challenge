import {
  composeSDKFactories,
  labelPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  createValidationPropsSDKFactory,
  createRequiredPropsSDKFactory,
  createValuePropsSdkFactory,
  createCheckedPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  ICheckboxProps,
  ICheckboxSDK,
  ICheckboxImperativeActions,
  ICheckboxOwnSDKFactory,
} from '../Checkbox.types';
import {
  composeSanitizers,
  numberToString,
  emptyStringIfNotString,
  InputValidator,
  createInputValidator,
  composeValidators,
  validateRequiredChecked,
  createEmptyInputValidator,
} from '../../../core/corvid/inputUtils';

const checkboxValueGetter = (props: ICheckboxProps) => props.checked;

const checkboxInputValidator: InputValidator<
  ICheckboxProps,
  ICheckboxImperativeActions
> = createInputValidator(
  composeValidators<ICheckboxProps>([validateRequiredChecked]),
  checkboxValueGetter,
);

const valueSanitizer = composeSanitizers([
  numberToString,
  emptyStringIfNotString,
]);

const validationPropsSDKFactory = createValidationPropsSDKFactory(
  checkboxInputValidator,
);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory(
  checkboxInputValidator,
);

const valuePropsSDKFactory = createValuePropsSdkFactory<
  ICheckboxProps,
  ICheckboxImperativeActions
>(
  value => valueSanitizer(value),
  { type: ['string'] },
  createEmptyInputValidator(),
);

const checkedPropsSDKFactory = createCheckedPropsSDKFactory(
  checkboxInputValidator,
);

const ownSDKFactory: ICheckboxOwnSDKFactory = ({ props, metaData }) => {
  return {
    toJSON() {
      const { checked, required, value } = props;
      return {
        ...toJSONBase(metaData),
        checked,
        required,
        value,
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaControls: true,
  enableAriaErrorMessage: true,
  enableTabIndex: true,
});

export const sdk = composeSDKFactories<ICheckboxProps, ICheckboxSDK>(
  elementPropsSDKFactory,
  disablePropsSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
  clickPropsSDKFactory,
  requiredPropsSDKFactory,
  checkedPropsSDKFactory,
  validationPropsSDKFactory,
  valuePropsSDKFactory,
  createStylePropsSDKFactory({
    BackgroundColor: true,
    BorderColor: true,
    BorderWidth: true,
    BorderRadius: true,
  }),
  labelPropsSDKFactory,
  accessibilityPropsSDKFactory,
  ownSDKFactory,
);

export default createComponentSDKModel(sdk);
