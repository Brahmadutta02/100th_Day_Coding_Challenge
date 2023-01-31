import React from 'react';
import classnames from 'classnames';
import { SkinPageProps } from '../SkinPage';
import { TestIds } from '../../../constants';

export type BasePageSkinProps = SkinPageProps & {
  skinsStyle: { [key: string]: string };
};

const BasePageSkin: React.FC<BasePageSkinProps> = ({
  id,
  className,
  pageDidMount,
  onClick,
  onDblClick,
  children,
  skinsStyle,
  onMouseEnter,
  onMouseLeave,
}) => {
  const computedClass = classnames(
    skinsStyle.root,
    skinsStyle.pageWrapper,
    className,
  );

  return (
    <div
      id={id}
      className={computedClass}
      ref={pageDidMount}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={skinsStyle.bg} data-testid={TestIds.background} />
      <div className={skinsStyle.inlineContent}>{children()}</div>
    </div>
  );
};

export default BasePageSkin;
