import * as React from 'react';
import classNames from 'classnames';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import FillLayers from '../../FillLayers/viewer/FillLayers';
import { ClassicSectionProps } from '../ClassicSection.types';
import { MediaContainerVideoAPI } from '../../MediaContainers/MediaContainer/MediaContainer.types';
import { useVideoAPI } from '../../../core/useVideoAPI';
import { getDataAttributes } from '../../../core/commons/utils';
import styles from './style/ClassicSection.scss';

const ClassicSection: React.ForwardRefRenderFunction<
  MediaContainerVideoAPI,
  ClassicSectionProps
> = (props, compRef) => {
  const {
    id,
    fillLayers = {},
    className,
    meshProps = {
      wedges: [],
      rotatedComponents: [],
    },
    anchorUrlFragment,
    children,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onDblClick,
    getPlaceholder,
    a11y = {},
    onStop,
    onReady,
  }: ClassicSectionProps = props;

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
      className={classNames(styles.container, className)}
    >
      {anchorUrlFragment && (
        <div className={styles.anchorElement} id={anchorUrlFragment} />
      )}
      <FillLayers
        {...fillLayers}
        onReady={onReady}
        getPlaceholder={getPlaceholder}
        videoRef={videoRef}
      />

      <MeshContainer
        id={id}
        {...meshProps}
        extraClassName={classNames({
          [styles.fixFlashingContent]: shouldFixContentFlashing,
        })}
      >
        {children}
      </MeshContainer>
    </section>
  );
};

export default React.forwardRef(ClassicSection);
