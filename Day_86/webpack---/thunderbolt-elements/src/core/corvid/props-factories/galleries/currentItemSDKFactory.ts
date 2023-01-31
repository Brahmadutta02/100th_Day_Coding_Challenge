import { withValidation } from '@wix/editor-elements-corvid-utils';
import type { CorvidTypes } from '@wix/editor-elements-types/corvid';
import { convertGalleryItemsToUserModel } from '../../galleries/GallerySDKUtils';
import {
  GalleryItemProps,
  ItemUserModel,
} from '../../galleries/GalleriesSDK.types';

export type OnCurrentItemChangedEvent = {
  type: string;
  item: ItemUserModel;
  itemIndex: number;
};

export interface ICurrentItemSDKProps {
  items: Array<GalleryItemProps>;
  currentIndex: number;
}

export interface ICurrentItemSDK {
  onCurrentItemChanged(
    handler: (event: OnCurrentItemChangedEvent) => void,
  ): void;
  currentIndex: number;
  currentItem: ItemUserModel | undefined;
}

export interface ICurrentItemSDKActions {
  onCurrentItemChanged(event: {
    itemIndex: number;
    type: 'imageChanged';
  }): void;
}

const _currentItemSDKFactory: CorvidTypes.CorvidSDKFactory<
  ICurrentItemSDKProps,
  ICurrentItemSDK
> = ({ registerEvent, platformUtils: { linkUtils }, props }) => {
  return {
    get currentItem() {
      if (!props.items || props.items.length === 0) {
        return undefined;
      }
      const currentItem = props.items[props.currentIndex];
      const convertedItemToUserModel = convertGalleryItemsToUserModel(
        [currentItem],
        linkUtils,
      );
      return convertedItemToUserModel[0];
    },
    get currentIndex() {
      return props.currentIndex;
    },
    onCurrentItemChanged(handler) {
      registerEvent(
        'onCurrentItemChanged',
        (event: OnCurrentItemChangedEvent) => {
          const changedItem = props.items[event.itemIndex];
          [event.item] = convertGalleryItemsToUserModel(
            [changedItem],
            linkUtils,
          );
          handler(event);
        },
      );
    },
  };
};

export const currentItemSDKFactory = withValidation(_currentItemSDKFactory, {
  type: ['object'],
  properties: {
    onCurrentItemChanged: {
      type: ['function'],
      args: [{ type: ['function'] }],
    },
  },
});
