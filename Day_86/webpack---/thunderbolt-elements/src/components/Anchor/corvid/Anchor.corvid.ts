import {
  composeSDKFactories,
  basePropsSDKFactory,
  createViewportPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { IAnchorSDKFactory } from '../Anchor.types';

const anchorSDKFactory: IAnchorSDKFactory = ({ props, metaData }) => ({
  get name() {
    return props.name;
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      name: props.name,
    };
  },
});

export const sdk: IAnchorSDKFactory = composeSDKFactories(
  basePropsSDKFactory,
  createViewportPropsSDKFactory(),
  anchorSDKFactory,
);

export default createComponentSDKModel(sdk);
