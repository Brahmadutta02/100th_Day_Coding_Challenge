import {
  composeSDKFactories,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  createElementPropsSDKFactory,
  toJSONBase,
  backgroundPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  IMediaContainerSDK,
  IMediaContainerSDKFactory,
  MediaContainerCompProps,
  IMediaContainerOwnSDKFactory,
} from '../MediaContainer.types';

const type = '$w.Container';

const mediaContainerSDKFactory: IMediaContainerOwnSDKFactory = ({
  metaData,
}) => {
  return {
    get type() {
      return type;
    },
    toJSON() {
      return {
        ...toJSONBase(metaData),
        type,
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk: IMediaContainerSDKFactory = composeSDKFactories<
  MediaContainerCompProps,
  IMediaContainerSDK
>(
  elementPropsSDKFactory,
  mediaContainerSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  backgroundPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
