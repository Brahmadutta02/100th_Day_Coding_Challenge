import {
  composeSDKFactories,
  backgroundPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { corvidName as type } from '../constants';
import {
  IClassicSectionOwnSDKFactory,
  IClassicSectionSDK,
  IClassicSectionSDKFactory,
  ClassicSectionProps,
} from '../ClassicSection.types';

const classicSectionSDKFactory: IClassicSectionOwnSDKFactory = sdkProps => {
  const { metaData } = sdkProps;

  return {
    ...backgroundPropsSDKFactory(sdkProps),
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

export const sdk: IClassicSectionSDKFactory = composeSDKFactories<
  ClassicSectionProps,
  IClassicSectionSDK
>(
  elementPropsSDKFactory,
  classicSectionSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
