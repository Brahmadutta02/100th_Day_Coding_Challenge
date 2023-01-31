import * as React from 'react';
import classNamesFn from 'classnames';
import { IMasterPageProps } from '../MasterPage.types';
import { getDataAttributes } from '../../../core/commons/utils';

const MasterPage: React.FC<IMasterPageProps> = props => {
  const { classNames = {}, pageDidMount, children, className } = props;
  const wrapperClasses = classNamesFn(Object.values(classNames), className);

  return (
    <div
      id="masterPage"
      {...getDataAttributes(props)}
      className={wrapperClasses}
      ref={pageDidMount}
    >
      {children()}
    </div>
  );
};

export default MasterPage;
