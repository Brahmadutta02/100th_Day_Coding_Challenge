import * as React from 'react';
import { BackgroundOverlayProps } from '../BackgroundOverlay.types';
import { TestIds } from '../constants';
import BackgroundImage from '../../BackgroundImage/viewer/BackgroundImage';
import styles from './style/BackgroundOverlay.scss';

const BackgroundOverlay: React.FC<BackgroundOverlayProps> = props => {
  const { imageOverlay } = props;

  return (
    <div data-testid={TestIds.bgOverlay} className={styles.bgOverlay}>
      {imageOverlay && (
        <BackgroundImage
          customIdPrefix="bgImgOverlay_"
          className={styles.bgImgOverlay}
          {...imageOverlay}
        ></BackgroundImage>
      )}
    </div>
  );
};

export default BackgroundOverlay;
