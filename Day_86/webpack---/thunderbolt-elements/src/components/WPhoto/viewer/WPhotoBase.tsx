import * as React from 'react';
import { IWPhotoProps } from '../WPhoto.types';
import { TRANSPARENT_BASE64_PIXEL } from '../constants';
import { replaceCompIdPlaceholder } from '../../../core/commons/vectorImageUtils';
import { isExternalUrl } from '../utils/url';

const WPhoto: React.FC<IWPhotoProps> = props => {
  const {
    skin: WPhotoClass,
    id,
    uri,
    alt,
    name,
    width,
    height,
    displayMode,
    focalPoint,
    filterEffectSvgUrl: originalFilterEffectSvgUrl,
    quality,
    crop,
    onSizeChange,
    onLoad,
    getPlaceholder,
    containerWidth,
    containerHeight,
    isInFirstFold,
    lazyLoadImgExperimentOpen,
  } = props;

  // This only runs for external image URLs set using SDK code. Once the image
  // is loaded we update original width/height props so fit mode can use correct
  // aspect ratio with the new external image source.
  const handleExternalImageLoad: React.ReactEventHandler = event => {
    const { naturalWidth, naturalHeight } = event.target as HTMLImageElement;
    if (
      !naturalWidth ||
      !naturalHeight ||
      (naturalWidth === width && naturalHeight === height)
    ) {
      return;
    }

    onSizeChange(naturalWidth, naturalHeight);
    onLoad?.();
  };

  const imageProps = {
    containerId: id,
    uri: uri || TRANSPARENT_BASE64_PIXEL,
    alt,
    name,
    width,
    height,
    displayMode,
    focalPoint,
    quality,
    crop,
    onLoad: onLoad && isExternalUrl(uri) ? handleExternalImageLoad : undefined,
    getPlaceholder,
    containerWidth,
    containerHeight,
    isInFirstFold,
    lazyLoadImgExperimentOpen,
  };
  const filterEffectSvgUrl = originalFilterEffectSvgUrl
    ? replaceCompIdPlaceholder(originalFilterEffectSvgUrl, id)
    : undefined;
  return (
    <WPhotoClass
      {...props}
      imageProps={imageProps}
      filterEffectSvgUrl={filterEffectSvgUrl}
    />
  );
};

export default WPhoto;
