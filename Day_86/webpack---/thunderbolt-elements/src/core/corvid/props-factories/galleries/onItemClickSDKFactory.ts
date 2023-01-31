import { registerCorvidEvent } from '@wix/editor-elements-corvid-utils';
import type {
  CorvidTypes,
  ICorvidEvent,
  ICorvidEventHandler,
  IComponentEvent,
} from '@wix/editor-elements-types/corvid';
import { convertGalleryItemsToUserModel } from '../../galleries/GallerySDKUtils';
import {
  ItemUserModel,
  GalleryItemProps,
} from '../../galleries/GalleriesSDK.types';

export interface IGalleryOnItemClickedPropsSDKProps {
  items: Array<GalleryItemProps>;
}

export type OnItemClickedPayload = {
  item: ItemUserModel;
  itemIndex: number;
};

export type OnItemClickedComponentPayload = IComponentEvent<
  'onItemClicked',
  OnItemClickedPayload
>;

export type OnItemClickedCorvidEvent = ICorvidEvent<
  'onItemClicked',
  OnItemClickedPayload
>;

export type IGalleryOnItemClickedSDKAction = {
  onItemClicked: (event: OnItemClickedComponentPayload) => void;
};

export interface IGalleryOnItemClickedSDKProps {
  onItemClicked(handler: ICorvidEventHandler<OnItemClickedCorvidEvent>): void;
}

export const onItemClickSDKFactory: CorvidTypes.CorvidSDKFactory<
  IGalleryOnItemClickedPropsSDKProps,
  IGalleryOnItemClickedSDKProps
> = api => {
  return {
    onItemClicked(handler) {
      registerCorvidEvent<
        OnItemClickedComponentPayload,
        OnItemClickedCorvidEvent
      >('onItemClicked', api, handler, ({ componentEvent }) => {
        const convertedItemToUserModel = convertGalleryItemsToUserModel(
          [api.props.items[componentEvent.itemIndex]],
          api.platformUtils.linkUtils,
        )[0];
        return {
          ...componentEvent,
          item: convertedItemToUserModel,
        };
      });
    },
  };
};
