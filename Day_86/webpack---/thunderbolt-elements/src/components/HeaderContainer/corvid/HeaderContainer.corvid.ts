import {
  composeSDKFactories,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { styleMixinPrefix } from '../../ScreenWidthContainer/constants';
import { corvidName as type } from '../constants';
import {
  IHeaderContainerOwnSDKFactory,
  IHeaderContainerProps,
  IHeaderContainerSDK,
  IHeaderContainerSDKFactory,
} from '../HeaderContainer.types';

const headerContainerSDKFactory: IHeaderContainerOwnSDKFactory = ({
  metaData,
}) => ({
  get type() {
    return type;
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      type,
    };
  },
});

export const stylePropsSDKFactory = createStylePropsSDKFactory(
  {
    BackgroundColor: true,
    BorderColor: true,
  },
  {
    cssVarPrefix: styleMixinPrefix,
  },
);

const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed: false,
});
export const sdk: IHeaderContainerSDKFactory = composeSDKFactories<
  IHeaderContainerProps,
  IHeaderContainerSDK
>(
  elementPropsSDKFactory,
  headerContainerSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
);

export default createComponentSDKModel(sdk);
