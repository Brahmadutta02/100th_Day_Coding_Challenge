import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import { MediaContainerCompProps } from '../MediaContainer.types';
import MeshContainer from '../../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import FillLayers from '../../../FillLayers/viewer/FillLayers';
import styles from './styles/MediaContainer.scss';

const MediaContainerContent: FunctionComponent<MediaContainerCompProps> = ({
  id,
  fillLayers,
  children,
  meshProps,
  videoRef,
  getPlaceholder,
  onReady,
}) => {
  // fix content in front of background in position:fixed disappearing when scrolling to it - Chromium +85 bug
  const shouldFixFlashingContent = fillLayers.hasBgFullscreenScrollEffect;

  return (
    <>
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
          [styles.fixFlashingContent]: shouldFixFlashingContent,
        })}
      >
        {children}
      </MeshContainer>
    </>
  );
};

export default MediaContainerContent;
