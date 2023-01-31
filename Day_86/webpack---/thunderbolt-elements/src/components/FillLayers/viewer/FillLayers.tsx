import * as React from 'react';
import classNames from 'classnames';
import Image from '../../Image/viewer/Image';
import BackgroundImage from '../../BackgroundImage/viewer/BackgroundImage';
import Video from '../../Video/viewer/Video';
import BackgroundMedia from '../../BackgroundMedia/viewer/BackgroundMedia';
import BackgroundOverlay from '../../BackgroundOverlay/viewer/BackgroundOverlay';
import { FillLayersProps } from '../FillLayers.types';
import { TestIds } from '../constants';
import hoverBoxUtils from '../../MediaContainers/HoverBox/utils';
import styles from './style/FillLayers.scss';
import { useOnLoadsEvents } from './useOnLoadsEvents';

const IMAGE_CLASS_FOR_LAYOUT = 'bgImage';

const FillLayers: React.FC<FillLayersProps> = props => {
  const {
    videoRef,
    canvasRef,
    hasBgFullscreenScrollEffect,
    image,
    backgroundImage,
    backgroundMedia,
    video,
    backgroundOverlay,
    shouldPadMedia,
    extraClass = '',
    shouldRenderUnderlay = !video,
    reducedMotion = false,
    getPlaceholder,
  } = props;
  const { onImageLoad } = useOnLoadsEvents(props);
  // fix containerId to support hoverBox component
  const containerId = hoverBoxUtils.getDefaultId(props.containerId);
  const fixedImageId = `img_${hoverBoxUtils.getDefaultId(containerId)}`;

  const ImageComponent = image && (
    <Image
      id={fixedImageId}
      className={classNames(
        styles.fillLayer,
        styles.imageFillLayer,
        styles.transforms,
        IMAGE_CLASS_FOR_LAYOUT,
      )}
      // overriding dimensions returned from  imageClientApi.getPlaceholder().css.img
      imageStyles={{ width: '100%', height: '100%' }}
      getPlaceholder={getPlaceholder}
      {...image}
      onLoad={onImageLoad}
    />
  );
  const BackgroundImageComponent = backgroundImage && (
    <BackgroundImage
      {...backgroundImage}
      containerId={containerId}
      className={classNames(
        styles.fillLayer,
        styles.imageFillLayer,
        styles.transforms,
        IMAGE_CLASS_FOR_LAYOUT,
      )}
      getPlaceholder={getPlaceholder}
    />
  );
  const VideoComponent = video && (
    <Video
      id={`videoContainer_${containerId}`}
      {...video}
      extraClassName={styles.videoFillLayer}
      reducedMotion={reducedMotion}
      videoRef={videoRef}
      getPlaceholder={getPlaceholder}
    />
  );

  const Media = (
    <React.Fragment>
      {ImageComponent}
      {BackgroundImageComponent}
      {VideoComponent}
      {canvasRef && (
        <canvas
          id={`${containerId}webglcanvas`}
          ref={canvasRef}
          className={classNames(styles.alphaCanvas, 'webglcanvas')}
          aria-label={video?.alt || ''}
          role="presentation"
          data-testid={TestIds.canvas}
        />
      )}
    </React.Fragment>
  );

  const BgMedia = backgroundMedia ? (
    <BackgroundMedia id={`bgMedia_${containerId}`} {...backgroundMedia}>
      {Media}
    </BackgroundMedia>
  ) : (
    <div id={`bgMedia_${containerId}`} className={styles.bgMedia}>
      {Media}
    </div>
  );
  const BgOverlay = backgroundOverlay && (
    <BackgroundOverlay {...backgroundOverlay} />
  );

  return (
    <div
      id={`${TestIds.bgLayers}_${containerId}`}
      data-hook={TestIds.bgLayers}
      className={classNames(styles.layersContainer, extraClass, {
        [styles.fullScreenScrollEffect]: hasBgFullscreenScrollEffect,
      })}
    >
      {shouldRenderUnderlay && (
        <div
          data-testid={TestIds.colorUnderlay}
          className={classNames(styles.bgUnderlay, styles.fillLayer)}
        />
      )}
      {shouldPadMedia ? (
        <div
          data-testid={TestIds.mediaPadding}
          className={styles.mediaPaddingLayer}
        >
          {BgMedia}
          {BgOverlay}
        </div>
      ) : (
        <React.Fragment>
          {BgMedia}
          {BgOverlay}
        </React.Fragment>
      )}
    </div>
  );
};

export default FillLayers;
