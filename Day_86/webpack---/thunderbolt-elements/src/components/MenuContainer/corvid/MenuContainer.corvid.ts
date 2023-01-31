import {
  composeSDKFactories,
  createElementPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { IMenuContainerSDKFactory } from '../MenuContainer.types';

const _sdk: IMenuContainerSDKFactory = ({ handlers, metaData }) => ({
  open() {
    handlers.openMenuContainer(metaData.compId);
  },
  close() {
    handlers.closeMenuContainer(metaData.compId);
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed: false,
});

export const sdk: IMenuContainerSDKFactory = composeSDKFactories(
  elementPropsSDKFactory,
  _sdk,
);

export default createComponentSDKModel(sdk);
