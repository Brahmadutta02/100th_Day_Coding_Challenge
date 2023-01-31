import { withValidation, assert } from '@wix/editor-elements-corvid-utils';
import type { CorvidTypes } from '@wix/editor-elements-types/corvid';

enum GALLERY_CLICK_ACTIONS {
  none = 'disabled',
  expand = 'zoomMode',
  link = 'goToLink',
}

export interface IClickActionPropsSDKProps {
  imageOnClickAction: 'disabled' | 'zoomMode' | 'goToLink';
}

export interface IClickActionPropsSDK {
  clickAction: 'none' | 'expand' | 'link' | null;
}
const _clickActionSDKFactory: CorvidTypes.CorvidSDKFactory<
  IClickActionPropsSDKProps,
  IClickActionPropsSDK
> = ({ setProps, props }) => {
  return {
    get clickAction() {
      const { imageOnClickAction: action } = props;
      switch (action) {
        case 'disabled':
          return 'none';
        case 'goToLink':
          return 'link';
        default:
        case 'zoomMode':
          return 'expand';
      }
    },
    set clickAction(action) {
      const galleryImageClickAction = assert.isNil(action)
        ? GALLERY_CLICK_ACTIONS.none
        : GALLERY_CLICK_ACTIONS[action];
      setProps({
        imageOnClickAction: galleryImageClickAction,
      });
    },
  };
};

export const clickActionSDKFactory = withValidation(_clickActionSDKFactory, {
  type: ['object'],
  properties: {
    clickAction: {
      warnIfNil: true,
      type: ['string'],
      enum: Object.keys(GALLERY_CLICK_ACTIONS),
    },
  },
});
