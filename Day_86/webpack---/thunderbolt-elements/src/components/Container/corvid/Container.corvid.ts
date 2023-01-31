import {
  composeSDKFactories,
  createAccessibilityPropSDKFactory,
  keyUpPropsSDKFactory,
  createStylePropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  createElementPropsSDKFactory,
  focusPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import {
  IContainerSDK,
  IContainerProps,
  IContainerSDKFactory,
} from '../Container.types';

const containerSDKFactory: IContainerSDKFactory = ({ metaData }) => ({
  get type() {
    return '$w.Box';
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      type: '$w.Box',
    };
  },
});

const stylePropsSDKFactory = createStylePropsSDKFactory(
  {
    BackgroundColor: true,
    BorderColor: true,
    BorderWidth: true,
  },
  {
    cssVarPrefix: 'container',
  },
);

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableRole: true,
  enableAriaHidden: true,
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaRoleDescription: true,
  enableAriaCurrent: true,
  enableAriaExpanded: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableTabIndex: true,
  enableAriaControls: true,
  enableAriaOwns: true,
});

export const sdk = composeSDKFactories<IContainerProps, IContainerSDK, any>(
  elementPropsSDKFactory,
  stylePropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  focusPropsSDKFactory,
  accessibilityPropsSDKFactory,
  containerSDKFactory,
  keyUpPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
