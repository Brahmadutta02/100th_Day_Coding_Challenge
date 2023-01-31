import * as React from 'react';
import classNames from 'classnames';
import Link from '../../Link/viewer/Link';
import Image from '../../Image/viewer/Image';
import { LinkBarProps } from '../LinkBar.types';
import { getDataAttributes } from '../../../core/commons/utils';
import * as translations from './constants';

const LinkBar: React.FC<LinkBarProps> = props => {
  const {
    id,
    className,
    getPlaceholder,
    iconSize,
    shouldRenderPlaceholders = false,
    translate,
    images,
    onMouseEnter,
    onMouseLeave,
    styles,
  } = props;

  const getImageProps = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    link,
    ...imageProps
  }: LinkBarProps['images'][number]) => imageProps;

  const translatedAriaLabel = translate!(
    translations.ARIA_LABEL_NAMESPACE,
    translations.ARIA_LABEL_KEY,
    translations.ARIA_LABEL_DEFAULT,
  );
  const placeholderProps =
    shouldRenderPlaceholders && iconSize && getPlaceholder
      ? {
          getPlaceholder,
          containerWidth: iconSize,
          containerHeight: iconSize,
        }
      : {};

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(className, styles.root)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className={styles.container} aria-label={translatedAriaLabel}>
        {images.map((imageProps, index) => (
          <li
            id={imageProps.containerId}
            key={imageProps.containerId}
            className={styles.listItem}
          >
            <Link className={styles.link} {...imageProps.link}>
              <Image
                id={`img_${index}_${id}`}
                {...getImageProps(imageProps)}
                className={styles.image}
                {...placeholderProps}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkBar;
