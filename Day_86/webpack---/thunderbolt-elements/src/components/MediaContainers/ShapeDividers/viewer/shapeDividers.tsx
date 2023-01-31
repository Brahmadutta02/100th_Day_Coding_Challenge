import * as React from 'react';
import classNames from 'classnames';
import { DividersProps, DividerLayerStyle } from '../shapeDividers.types';
import styles from './style/shapeDividers.scss';

const generateLayers = (hasDivider: boolean, layersSize?: number) => {
  return hasDivider
    ? [...Array(1 + (layersSize || 0)).keys()]
        .reverse()
        .map(i => (
          <div
            style={{ '--divider-layer-i': i } as DividerLayerStyle}
            className={styles.dividerLayer}
            data-testid={`divider-layer-${i}`}
          />
        ))
    : null;
};

export const generateDivider = (
  side: 'top' | 'bottom',
  hasDivider?: boolean,
  size?: number,
) => {
  const dividerLayers = generateLayers(!!hasDivider, size);

  return hasDivider ? (
    <div
      className={classNames(styles.shapeDivider, {
        [styles.topShapeDivider]: side === 'top',
        [styles.bottomShapeDivider]: side === 'bottom',
      })}
      data-testid={`${side}-divider`}
    >
      {dividerLayers}
    </div>
  ) : null;
};

const ShapeDividers: React.FC<DividersProps> = dividers => {
  const topDivider = React.useMemo(() => {
    return generateDivider(
      'top',
      dividers?.hasTopDivider,
      dividers?.topLayers?.size,
    );
  }, [dividers?.hasTopDivider, dividers?.topLayers?.size]);

  const bottomDivider = React.useMemo(() => {
    return generateDivider(
      'bottom',
      dividers?.hasBottomDivider,
      dividers?.bottomLayers?.size,
    );
  }, [dividers?.hasBottomDivider, dividers?.bottomLayers?.size]);

  return (
    <>
      {topDivider}
      {bottomDivider}
    </>
  );
};

export default ShapeDividers;
