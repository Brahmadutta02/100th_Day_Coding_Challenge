import {
  composeSDKFactories,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { CorvidTypes } from '@wix/editor-elements-types/corvid';
import {
  IFormContainerProps,
  IFormContainerSdkProps,
} from '../FormContainer.types';

export const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
});

export const formContainerSDKFactory: CorvidTypes.CorvidSDKFactory<any> = ({
  metaData,
}) => ({
  get type() {
    return '$w.Form';
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      type: '$w.Form',
    };
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<
  IFormContainerProps,
  IFormContainerSdkProps
>(
  elementPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
  formContainerSDKFactory,
);

export default createComponentSDKModel(sdk);
