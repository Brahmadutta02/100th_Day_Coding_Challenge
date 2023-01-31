import * as React from 'react';
import { ImageProps } from '@wix/thunderbolt-components-native';
import classNames from 'classnames';
import { ImageButtonProps } from '../ImageButton.types';
import Image from '../../Image/viewer/Image';
import { TestIds } from '../constants';
import { getAriaAttributes } from '../../../core/commons/a11y';
import Link from '../../Link/viewer/Link';
import { getDataAttributes } from '../../../core/commons/utils';
import style from './style/ImageButton.scss';

const ImageButton: React.FC<ImageButtonProps> = props => {
  const {
    id,
    className,
    link,
    alt,
    transition,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    hasPlatformClickHandler,
    isDisabled,
    getPlaceholder,
    containerWidth,
    containerHeight,
    ariaAttributes,
  } = props;
  const images: Array<{ props: ImageProps; className: string }> = [
    { props: props.defaultImage, className: style.defaultImage },
    { props: props.hoverImage, className: style.hoverImage },
    { props: props.activeImage, className: style.activeImage },
  ];

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(className, {
        [style.transition_none]: transition === 'none',
        [style.transition_fade]: transition === 'fade',
        [style.clickable]: hasPlatformClickHandler,
      })}
      onDragStart={e => e.preventDefault()}
      onClick={!isDisabled ? onClick : undefined}
      onDoubleClick={!isDisabled ? onDblClick : undefined}
      onMouseEnter={!isDisabled ? onMouseEnter : undefined}
      onMouseLeave={!isDisabled ? onMouseLeave : undefined}
    >
      <Link
        {...link}
        {...getAriaAttributes(ariaAttributes)}
        className={style.link}
        dataTestId={TestIds.link}
        title={alt}
        role="img"
      >
        {images.map((image, index) => (
          <div className={style.correctPositioning} key={index}>
            <Image
              id={`img_${id}_${index}`}
              {...image.props}
              displayMode="fit"
              alt=""
              role="none"
              containerId={id}
              className={image.className}
              getPlaceholder={getPlaceholder}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </div>
        ))}
      </Link>
    </div>
  );
};

export default ImageButton;
