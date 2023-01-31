import {
  IPlatformData,
  withCompController,
} from '@wix/editor-elements-integrations';
import { getValidationControllerProps } from '../../../core/commons/controllerUtils';
import type {
  ITextInputControllerProps,
  ITextInputMapperProps,
  ITextInputProps,
} from '../TextInput.types';

const getComponentProps = ({
  mapperProps,
  controllerUtils,
}: IPlatformData<
  ITextInputMapperProps,
  ITextInputProps,
  never
>): ITextInputControllerProps => {
  return {
    ...mapperProps,
    ...getValidationControllerProps(controllerUtils.updateProps),
  };
};

export default withCompController(getComponentProps);
