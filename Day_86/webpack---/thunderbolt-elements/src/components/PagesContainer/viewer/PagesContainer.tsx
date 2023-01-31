import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import { IPagesContainerProps } from '../PagesContainer.types';

const PagesContainer: React.FC<IPagesContainerProps> = props => {
  const { children, className } = props;
  return (
    <main
      id="PAGES_CONTAINER"
      {...getDataAttributes(props)}
      className={className}
      tabIndex={-1}
      data-main-content={true}
    >
      {children()}
    </main>
  );
};

export default PagesContainer;
