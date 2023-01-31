import {
  CustomValidator,
  ValidationData,
  TViewerSdkAPI,
} from './inputValidationTypes';
import { INITIAL_VALIDATION_DATA } from './validityUtils';

interface IValidationPropSDKState {
  validationData: ValidationData;
  customValidators: Array<CustomValidator>;
}

const defaultState: IValidationPropSDKState = {
  validationData: INITIAL_VALIDATION_DATA,
  customValidators: [() => {}],
};

const NAMESPACE = 'validation';

export const getValidationData = ({
  createSdkState,
}: TViewerSdkAPI): ValidationData => {
  const [state] = createSdkState(defaultState, NAMESPACE);
  return state.validationData;
};

export const setValidationData = (
  { createSdkState }: TViewerSdkAPI,
  validationData: ValidationData,
) => {
  const [, setState] = createSdkState(defaultState, NAMESPACE);
  setState({ validationData });
};

export const getCustomValidator = ({
  createSdkState,
}: TViewerSdkAPI): CustomValidator => {
  const [{ customValidators }] = createSdkState(defaultState, NAMESPACE);

  return (value, reject) => {
    let abortValidation = false;
    const innerReject = (rejectMessage: string) => {
      abortValidation = true;
      reject(rejectMessage);
    };

    for (
      let idx = 0;
      idx < customValidators.length && !abortValidation;
      idx++
    ) {
      customValidators[idx](value, innerReject);
    }
  };
};

export const setCustomValidator = (
  { createSdkState }: TViewerSdkAPI,
  customValidator: CustomValidator,
  override = true,
) => {
  const [{ customValidators }, setState] = createSdkState(
    defaultState,
    NAMESPACE,
  );

  if (override) {
    setState({ customValidators: [customValidator] });
  } else {
    setState({
      customValidators: [...customValidators, customValidator],
    });
  }
};
