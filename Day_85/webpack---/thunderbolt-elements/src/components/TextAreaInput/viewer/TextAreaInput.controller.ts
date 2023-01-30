import {
  IPlatformData,
  withCompController,
} from '@wix/editor-elements-integrations';
import { getValidationControllerProps } from '../../../core/commons/controllerUtils';
import type {
  ITextAreaInputControllerProps,
  ITextAreaInputMapperProps,
  ITextAreaInputProps,
} from '../TextAreaInput.types';

const getComponentProps = ({
  mapperProps,
  controllerUtils,
}: IPlatformData<
  ITextAreaInputMapperProps,
  ITextAreaInputProps,
  never
>): ITextAreaInputControllerProps => {
  return {
    ...mapperProps,
    ...getValidationControllerProps(controllerUtils.updateProps),
  };
};

export default withCompController(getComponentProps);
