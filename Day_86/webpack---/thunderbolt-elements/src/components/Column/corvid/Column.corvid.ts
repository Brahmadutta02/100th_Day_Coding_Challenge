import {
  composeSDKFactories,
  createAccessibilityPropSDKFactory,
  focusPropsSDKFactory,
  keyDownPropsSDKFactory,
  keyUpPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import type { CorvidTypes } from '@wix/editor-elements-types/corvid';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import {
  MediaContainerCompProps,
  IMediaContainerSDK,
} from '../../MediaContainers/MediaContainer/MediaContainer.types';
import { sdk as mediaContainerPropsSDKFactory } from '../../MediaContainers/MediaContainer/corvid/MediaContainer.corvid';

const columnPropsSDKFactory: CorvidTypes.CorvidSDKFactory = ({ metaData }) => ({
  get type() {
    return '$w.Column';
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      type: '$w.Column',
    };
  },
});

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableRole: true,
  enableAriaHidden: true,
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableTabIndex: true,
});

export const sdk = composeSDKFactories<
  MediaContainerCompProps,
  IMediaContainerSDK
>(
  mediaContainerPropsSDKFactory,
  columnPropsSDKFactory,
  accessibilityPropsSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
