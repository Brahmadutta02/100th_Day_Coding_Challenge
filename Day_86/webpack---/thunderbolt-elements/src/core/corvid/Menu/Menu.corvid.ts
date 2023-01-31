import {
  composeSDKFactories,
  menuItemsPropsSDKFactory,
  createElementPropsSDKFactory,
  changePropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { menuPropsSDKFactory } from './menuItemsPropsSDKFactory';
import { IMenuSDK, MenuProps } from './Menu.types';

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<MenuProps, IMenuSDK>(
  elementPropsSDKFactory,
  changePropsSDKFactory,
  menuPropsSDKFactory,
  menuItemsPropsSDKFactory,
);
