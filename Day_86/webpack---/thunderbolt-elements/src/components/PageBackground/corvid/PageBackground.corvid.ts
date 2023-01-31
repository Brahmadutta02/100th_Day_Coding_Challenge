import {
  composeSDKFactories,
  backgroundPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import {
  IPageBackgroundSDK,
  IPageBackgroundSDKFactory,
  PageBackgroundProps,
} from '../PageBackground.types';

export const sdk: IPageBackgroundSDKFactory = composeSDKFactories<
  PageBackgroundProps,
  IPageBackgroundSDK
>(backgroundPropsSDKFactory);

export default createComponentSDKModel(sdk);
