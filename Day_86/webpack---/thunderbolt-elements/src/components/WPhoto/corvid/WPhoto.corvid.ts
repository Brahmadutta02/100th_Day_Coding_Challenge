import {
  composeSDKFactories,
  reportError,
  withValidation,
  createElementPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  toJSONBase,
  parseMediaSrc,
  createMediaItemUri,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  IWPhotoProps,
  IWPhotoSDK,
  IWPhotoSDKFactory,
  IWPhotoOwnSDKFactory,
} from '../WPhoto.types';

import { isExternalUrl } from '../utils/url';

const IMAGE_CLICK_ACTIONS = {
  none: 'disabled',
  expand: 'zoomMode',
  link: 'goToLink',
  magnified: 'zoomAndPanMode',
} as const;
const IMAGE_CLICK_ACTIONS_INVERTED_MAP = {
  disabled: 'none',
  zoomMode: 'expand',
  goToLink: 'link',
  zoomAndPanMode: 'magnified',
} as const;
type IMAGE_CLICK_ACTIONS_KEYS = keyof typeof IMAGE_CLICK_ACTIONS;

const IMAGE_FIT_MODE_MAP = {
  fixedWidth: 'fitWidth',
  fit: 'fit',
  fill: 'fill',
} as const;
const IMAGE_FIT_MODE_INVERTED_MAP = {
  fitWidth: 'fixedWidth',
  fit: 'fit',
  fill: 'fill',
} as const;

type DisplayMode = 'fit' | 'fill' | 'fitWidth';
type FitMode = keyof typeof IMAGE_FIT_MODE_MAP;
type DimensionsOverrides = {
  width?: number;
  height?: number;
};

const _wPhotoSDKFactory: IWPhotoOwnSDKFactory = ({
  setProps,
  setStyles,
  registerEvent,
  props,
  metaData,
  sdkData,
}) => {
  const getSrc = () => {
    const { uri, height, width, title } = props;

    if (isExternalUrl(uri)) {
      return uri;
    }

    const mediaItemUri = createMediaItemUri({
      mediaId: uri,
      width,
      height,
      title,
      type: 'image',
    });
    if (mediaItemUri.error) {
      return '';
    }
    return mediaItemUri.item || '';
  };

  const getFitMode = (): FitMode =>
    IMAGE_FIT_MODE_INVERTED_MAP[props.displayMode as DisplayMode];

  const updateSizeForFitMode = (
    fitMode: FitMode,
    overrides?: DimensionsOverrides,
  ) => {
    const { layoutWidth, layoutHeight, paddingBottom } = sdkData;
    const width = layoutWidth;
    let height = layoutHeight;

    if (fitMode === 'fixedWidth') {
      const imageProportion =
        (overrides?.width || props.width) / (overrides?.height || props.height);
      height = Math.ceil(layoutWidth / imageProportion + paddingBottom);
    }

    setStyles({
      width: `${width}px`,
      height: `${height}px`,
    });
  };

  registerEvent('onLoad', () => {
    updateSizeForFitMode(getFitMode());
  });

  return {
    get src() {
      return getSrc();
    },
    set src(src: string) {
      if (!src) {
        setProps({ uri: '' });
      } else {
        const { height, width, title, mediaId, error } = parseMediaSrc(
          src,
          'image',
        );

        if (!error) {
          setProps({
            ...(height !== undefined ? { height } : {}),
            ...(width !== undefined ? { width } : {}),
            ...(title !== undefined ? { title } : {}),
            uri: mediaId,
            crop: null,
          });
          if (getFitMode() === IMAGE_FIT_MODE_INVERTED_MAP.fitWidth) {
            updateSizeForFitMode(IMAGE_FIT_MODE_INVERTED_MAP.fitWidth, {
              width,
              height,
            });
          }
        } else {
          reportError(
            `The "src" property cannot be set to "src". It must be a valid URL starting with "http://", "https://", or "wix:image://".`,
          );
        }
      }
    },
    get alt() {
      return props.alt;
    },
    set alt(alt) {
      setProps({ alt: alt || '' });
    },
    get tooltip() {
      return props.title;
    },
    set tooltip(tooltip) {
      setProps({ title: tooltip || '' });
    },
    get clickAction() {
      return IMAGE_CLICK_ACTIONS_INVERTED_MAP[props.onClickBehavior];
    },
    set clickAction(action: IMAGE_CLICK_ACTIONS_KEYS) {
      const onClickBehavior =
        IMAGE_CLICK_ACTIONS[action] || IMAGE_CLICK_ACTIONS.none;
      setProps({ onClickBehavior });
    },
    get fitMode() {
      return getFitMode();
    },
    set fitMode(value) {
      setProps({
        displayMode: IMAGE_FIT_MODE_MAP[value],
      });
      updateSizeForFitMode(value);
    },

    get type() {
      return '$w.Image';
    },

    toJSON() {
      const elementProps = toJSONBase(metaData);

      return {
        ...elementProps,
        alt: props.alt,
        tooltip: props.title,
        src: getSrc(),
        type: '$w.Image',
      };
    },
  };
};

export const WPhotoSDKFactory: IWPhotoOwnSDKFactory = withValidation(
  _wPhotoSDKFactory,
  {
    type: ['object'],
    properties: {
      src: { type: ['string', 'nil'], warnIfNil: true },
      description: { type: ['string', 'nil'], warnIfNil: true },
      title: { type: ['string', 'nil'], warnIfNil: true },
      alt: { type: ['string', 'nil'], warnIfNil: true },
      tooltip: { type: ['string', 'nil'], warnIfNil: true },
      width: { type: ['integer'] },
      height: { type: ['integer'] },
      clickAction: {
        type: ['string', 'nil'],
        enum: Object.keys(IMAGE_CLICK_ACTIONS),
        warnIfNil: true,
      },
      fitMode: {
        type: ['string'],
        enum: Object.keys(IMAGE_FIT_MODE_MAP),
      },
    },
  },
);
const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk: IWPhotoSDKFactory = composeSDKFactories<
  IWPhotoProps,
  IWPhotoSDK
>(
  elementPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  WPhotoSDKFactory,
);

export default createComponentSDKModel(sdk);
