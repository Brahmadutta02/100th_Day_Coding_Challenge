import classNames from 'classnames';
import React from 'react';
import { TestIds } from '../../../constants';
import { SkinPageProps } from '../SkinPage';
import styles from './styles/ResponsivePageWithColorBG.scss';

const ResponsivePageWithColorBG: React.FC<SkinPageProps> = ({
  id,
  className,
  pageDidMount,
  onClick,
  onDblClick,
  children,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      id={id}
      className={classNames(styles.root, className)}
      ref={pageDidMount}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.bg} data-testid={TestIds.background} />
      <div>{children()}</div>
    </div>
  );
};

export default ResponsivePageWithColorBG;
