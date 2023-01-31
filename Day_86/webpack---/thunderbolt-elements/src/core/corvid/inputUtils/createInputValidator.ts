import {
  ValidateFunction,
  InputValidator,
  OnValidateCallback,
  ValidateArgs,
} from './inputValidationTypes';
import {
  addCustomValidityToValidationData,
  checkCustomValidity,
} from './validityUtils';
import { getCustomValidator } from './validationPropsSdkState';

export const createInputValidator = <TProps, TCompRef>(
  componentValidator: ValidateFunction<TProps>,
  compValueGetter?: (props: TProps) => any,
): InputValidator<TProps, TCompRef> => {
  const callbacks: Array<OnValidateCallback<TProps, TCompRef>> = [];
  return {
    onValidate: cb => callbacks.push(cb),
    validate: ({ viewerSdkAPI, showValidityIndication }) => {
      const {
        props,
        metaData: { isRepeaterTemplate },
      } = viewerSdkAPI;

      // We don't want to validate on a repeater template
      // since the validation will use the template props
      if (isRepeaterTemplate) {
        return;
      }

      const validationDataResult = componentValidator(props, viewerSdkAPI);
      let updatedValidationData = validationDataResult;

      const customValidityMessage = checkCustomValidity<TProps>(
        getCustomValidator(viewerSdkAPI),
        props,
        compValueGetter,
      );

      if (customValidityMessage) {
        updatedValidationData = addCustomValidityToValidationData(
          validationDataResult,
          customValidityMessage,
        );
      }
      callbacks.forEach((cb: OnValidateCallback<TProps, TCompRef>) =>
        cb({
          viewerSdkAPI,
          showValidityIndication,
          validationDataResult: updatedValidationData,
        }),
      );
    },
  };
};

export const createEmptyInputValidator = <TProps, TCompRef>(): InputValidator<
  TProps,
  TCompRef
> => {
  return {
    onValidate: (_cb: OnValidateCallback<TProps, TCompRef>) => {},
    validate: (_args: ValidateArgs<TProps, TCompRef>) => {},
  };
};
