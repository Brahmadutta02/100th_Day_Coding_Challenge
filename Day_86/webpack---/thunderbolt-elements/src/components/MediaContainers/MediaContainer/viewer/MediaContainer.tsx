import React from 'react';
import classNames from 'classnames';
import type { TranslationGetter } from '@wix/editor-elements-types/thunderbolt';
import {
  MediaContainerCompProps,
  MediaContainerVideoAPI,
} from '../MediaContainer.types';
import {
  ARIA_LABEL_DEFAULT,
  ARIA_LABEL_KEY,
  ARIA_LABEL_NAMESPACE,
} from '../../../Container/viewer/shared/constants';
import { useVideoAPI } from '../../../../core/useVideoAPI';
import { getDataAttributes } from '../../../../core/commons/utils';
import MediaContainerContent from './MediaContainerContent';
import styles from './styles/MediaContainer.scss';

const getAriaLabel = (translate: TranslationGetter | undefined) => {
  return translate
    ? translate(ARIA_LABEL_NAMESPACE, ARIA_LABEL_KEY, ARIA_LABEL_DEFAULT)
    : ARIA_LABEL_DEFAULT;
};

const MediaContainer: React.ForwardRefRenderFunction<
  MediaContainerVideoAPI,
  MediaContainerCompProps
> = (props: MediaContainerCompProps, compRef) => {
  const {
    id,
    className,
    children,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    shouldAddTabIndex0: shouldAddA11yAttributes,
    hasPlatformClickHandler,
    translate,
    fillLayers,
    onStop,
  } = props;

  const rootClassName = classNames(className, styles.mediaContainer, {
    [styles.clickable]: hasPlatformClickHandler,
  });

  const a11yAttributes = shouldAddA11yAttributes
    ? { tabindex: 0, role: 'region', 'aria-label': getAriaLabel(translate) }
    : {};

  const hasVideo = !!fillLayers.video;
  const videoRef = useVideoAPI(compRef, hasVideo, onStop);

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={rootClassName}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...a11yAttributes}
    >
      <MediaContainerContent {...props} videoRef={videoRef}>
        {children}
      </MediaContainerContent>
    </div>
  );
};

export default React.forwardRef(MediaContainer);
