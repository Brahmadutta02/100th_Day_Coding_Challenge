import * as React from 'react';
import classNames from 'classnames';
import { Image as WowImage } from '@wix/image';
import { ImageProps } from '../Image.types';
import styles from './style/Image.scss';

const Image: React.FC<ImageProps> = props => {
  const {
    id,
    containerId,
    uri,
    alt,
    name,
    role,
    width,
    height,
    displayMode,
    devicePixelRatio,
    quality,
    alignType,
    hasBgScrollEffect,
    bgEffectName = '',
    focalPoint,
    upscaleMethod,
    className = '',
    crop,
    imageStyles = {},
    onLoad = () => {},
    onError = () => {},
    getPlaceholder,
    containerWidth,
    containerHeight,
    skipMeasure,
    targetScale,
    isInFirstFold,
    lazyLoadImgExperimentOpen,
    shouldUseWowImage,
  } = props;

  let hasSsrSrc = '';

  const ssrImageData = React.useRef<any>(null);

  if (!ssrImageData.current) {
    if (getPlaceholder) {
      const options = {
        upscaleMethod,
        ...(quality ? quality : {}),
        shouldLoadHQImage: isInFirstFold,
      };

      ssrImageData.current = getPlaceholder({
        fittingType: displayMode,
        src: {
          id: uri,
          width,
          height,
          crop,
          name,
          focalPoint,
        },
        target: {
          width: containerWidth,
          height: containerHeight,
          alignment: alignType,
          htmlTag: 'img',
        },
        options,
      });

      hasSsrSrc =
        !ssrImageData.current.transformed || isInFirstFold ? '' : 'true';
    } else {
      // to keep an empty placeholder data
      ssrImageData.current = {
        uri: undefined, // to remove src attribute completely
        css: { img: {} },
        attr: { img: {}, container: {} },
        transformed: false,
      };
    }
  }

  const imageInfo = React.useMemo(
    () =>
      JSON.stringify({
        containerId,
        ...(containerWidth && { targetWidth: containerWidth }),
        ...(containerHeight && { targetHeight: containerHeight }),
        ...(skipMeasure && { skipMeasure: true }),
        ...(alignType && { alignType }),
        ...(targetScale && { targetScale }),
        displayMode,
        imageData: {
          width,
          height,
          uri,
          name,
          displayMode,
          ...(quality && { quality }),
          ...(devicePixelRatio && { devicePixelRatio }),
          ...(focalPoint && { focalPoint }),
          ...(crop && { crop }),
          ...(upscaleMethod && { upscaleMethod }),
        },
      }),
    [
      containerId,
      containerWidth,
      containerHeight,
      targetScale,
      skipMeasure,
      alignType,
      displayMode,
      width,
      height,
      uri,
      name,
      quality,
      devicePixelRatio,
      focalPoint,
      crop,
      upscaleMethod,
    ],
  );

  const placeholder = ssrImageData.current;
  const src = placeholder?.uri;
  const srcset = placeholder?.srcset;
  const placeholderStyle = placeholder.css?.img;

  type ImageSharpeningQuality = {
    quality: number;
  };

  if (shouldUseWowImage) {
    const wowQuality = {
      quality: props.quality?.quality,
    } as ImageSharpeningQuality | undefined;
    return <WowImage {...props} quality={wowQuality} />;
  }

  return (
    <wix-image
      id={id}
      class={classNames(styles.image, className)}
      data-image-info={imageInfo}
      data-has-bg-scroll-effect={hasBgScrollEffect}
      data-bg-effect-name={bgEffectName}
      data-has-ssr-src={hasSsrSrc}
    >
      <img
        src={src}
        alt={alt || ''}
        role={role}
        style={{ ...placeholderStyle, ...imageStyles }}
        onLoad={onLoad}
        onError={onError}
        {...(isInFirstFold
          ? {
              srcSet: srcset?.dpr?.join(', '),
              fetchpriority: 'high',
            }
          : lazyLoadImgExperimentOpen
          ? { loading: 'lazy' }
          : {})}
      />
    </wix-image>
  );
};

export default Image;
