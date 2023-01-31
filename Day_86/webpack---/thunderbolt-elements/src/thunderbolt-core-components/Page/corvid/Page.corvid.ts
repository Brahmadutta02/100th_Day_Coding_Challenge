import {
  composeSDKFactories,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  childrenPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { PageProps, IPageSDK, IPageSDKFactory } from '../Page.types';

export const pageSDKFactory: IPageSDKFactory = ({
  sdkData,
  metaData,
  platformUtils,
}) => {
  const title = () => platformUtils.wixCodeNamespacesRegistry.get('seo').title;

  return {
    get description() {
      return sdkData.currentPageSEODescription;
    },

    get keywords() {
      return sdkData.currentPageSEOKeywords;
    },

    get title() {
      return title();
    },

    get visibleInMenu() {
      return sdkData.visibleInMenu;
    },

    toJSON() {
      return {
        ...toJSONBase(metaData),
        title: title(),
        description: sdkData.currentPageSEODescription,
        keywords: sdkData.currentPageSEOKeywords,
        visibleInMenu: sdkData.visibleInMenu,
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed: false,
});

export const sdk = composeSDKFactories<PageProps, IPageSDK>(
  elementPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  pageSDKFactory,
);

export default createComponentSDKModel(sdk);
