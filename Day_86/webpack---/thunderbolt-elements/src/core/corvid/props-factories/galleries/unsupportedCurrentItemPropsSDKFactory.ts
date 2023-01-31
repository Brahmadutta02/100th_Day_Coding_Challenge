import type { CorvidSDKPropsFactory } from '@wix/editor-elements-types/corvid';
import { createUnsupportedAPIReporter } from '../../galleries/GallerySDKUtils';
import { OnCurrentItemChangedEvent } from './currentItemSDKFactory';

export interface IUnsupportedCurrentItemSDK {
  onCurrentItemChanged(
    handler: (event: OnCurrentItemChangedEvent) => void,
  ): void;
  currentIndex: void;
  currentItem: void;
}

export const unsupportedCurrentItemPropsSDKFactory: CorvidSDKPropsFactory<
  {},
  IUnsupportedCurrentItemSDK
> = ({ metaData }) => {
  const galleryType = metaData.compType;
  const reportUnsupportedAPI = createUnsupportedAPIReporter(galleryType);

  return {
    get currentIndex() {
      return reportUnsupportedAPI('currentIndex');
    },
    get currentItem() {
      return reportUnsupportedAPI('currentItem');
    },
    onCurrentItemChanged() {
      return reportUnsupportedAPI('onCurrentItemChanged');
    },
  };
};
