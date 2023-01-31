import * as React from 'react';
import classNames from 'classnames';
import FillLayers from '../../FillLayers/viewer/FillLayers';
import { StripColumnsContainerProps } from '../StripColumnsContainer.types';
import { TestIds } from '../constants';
import { MediaContainerVideoAPI } from '../../MediaContainers/MediaContainer/MediaContainer.types';
import { useVideoAPI } from '../../../core/useVideoAPI';
import { getDataAttributes } from '../../../core/commons/utils';
import ShapeDividers from '../../MediaContainers/ShapeDividers/viewer/shapeDividers';
import styles from './style/StripColumnsContainer.scss';

const StripColumnsContainer: React.ForwardRefRenderFunction<
  MediaContainerVideoAPI,
  StripColumnsContainerProps
> = (props, compRef) => {
  const {
    id,
    className,
    fillLayers,
    children,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onDblClick,
    getPlaceholder,
    a11y = {},
    onStop,
    dividers,
    onReady,
  }: StripColumnsContainerProps = props;
  const sdkEventHandlers = {
    onMouseEnter,
    onMouseLeave,
    onClick,
    onDoubleClick: onDblClick,
  };

  // fix content in front of background in position:fixed disappearing when scrolling to it - Chromium +85 bug
  const shouldFixContentFlashing = fillLayers.hasBgFullscreenScrollEffect;

  const hasVideo = !!fillLayers.video;
  const videoRef = useVideoAPI(compRef, hasVideo, onStop);

  return (
    <section
      id={id}
      {...getDataAttributes(props)}
      {...sdkEventHandlers}
      {...a11y}
      className={classNames(className, styles.stripColumnsContainer)}
    >
      <FillLayers
        {...fillLayers}
        getPlaceholder={getPlaceholder}
        onReady={onReady}
        videoRef={videoRef}
      />
      {dividers && <ShapeDividers {...dividers} />}
      <div
        data-testid={TestIds.columns}
        className={classNames(styles.columns, {
          [styles.fixFlashingContent]: shouldFixContentFlashing,
        })}
      >
        {children()}
      </div>
    </section>
  );
};

export default React.forwardRef(StripColumnsContainer);
