import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import { PageProps } from '../Page.types';

const Page: React.FC<PageProps> = props => {
  const {
    id,
    className,
    skin: PageClass,
    pageDidMount,
    onClick = () => {},
    onDblClick = () => {},
    onMouseEnter,
    onMouseLeave,
    children,
  } = props;
  return (
    <PageClass
      id={id}
      className={className}
      {...getDataAttributes(props)}
      pageDidMount={pageDidMount}
      onClick={onClick}
      onDblClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children as () => React.ReactNode}
    </PageClass>
  );
};

export default Page;
