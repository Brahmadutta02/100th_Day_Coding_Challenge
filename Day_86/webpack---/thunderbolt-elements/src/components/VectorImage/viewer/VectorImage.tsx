import * as React from 'react';
import classNamesFn from 'classnames';

import { customCssClasses } from '@wix/editor-elements-common-utils';
import { VectorImageProps } from '../VectorImage.types';
import Link from '../../Link/viewer/Link';
import {
  replaceCompIdPlaceholder,
  replaceContentIds,
} from '../../../core/commons/vectorImageUtils';
import { getDataAttributes, isEmptyObject } from '../../../core/commons/utils';
import semanticClassNames from '../VectorImage.semanticClassNames';
import styles from './style/VectorImage.scss';

const VectorImage: React.FC<VectorImageProps> = props => {
  const {
    id,
    svgContent,
    shouldScaleStroke,
    withShadow,
    withStroke,
    link,
    ariaLabel,
    className = '',
    customClassNames = [],
    containerClass = '',
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    hasPlatformClickHandler,
  } = props;
  const classes = classNamesFn(
    styles.svgRoot,
    {
      [styles.nonScalingStroke]: !shouldScaleStroke,
      [styles.hasShadow]: withShadow,
      [styles.hasStroke]: withStroke,
      [styles.clickable]: hasPlatformClickHandler || onClick,
    },
    className,
  );

  const processedSvgContent = React.useMemo(() => {
    if (!svgContent) {
      return svgContent;
    }

    // avoid duplicate IDs in same document
    // mostly happens during page transitions - causes visual bugs - mostly on Safari
    const content = replaceContentIds(svgContent);

    return replaceCompIdPlaceholder(content, id);
  }, [id, svgContent]);

  const svgContentElement = (
    <div
      data-testid={`svgRoot-${id}`}
      className={classes}
      dangerouslySetInnerHTML={{
        __html: processedSvgContent,
      }}
    />
  );
  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNamesFn(
        containerClass,
        className,
        customCssClasses(semanticClassNames.root, ...customClassNames),
      )}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!isEmptyObject(link) ? (
        <Link className={styles.link} aria-label={ariaLabel} {...link}>
          {svgContentElement}
        </Link>
      ) : (
        svgContentElement
      )}
    </div>
  );
};

export default VectorImage;
