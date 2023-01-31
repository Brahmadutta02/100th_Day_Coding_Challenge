import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import { ContainerWrapperProps } from '../ContainerWrapper.types';

const ContainerWrapper: React.FC<ContainerWrapperProps> = props => {
  const { id, children, tagName, className } = props;
  const SemanticElement = tagName as keyof JSX.IntrinsicElements;
  return (
    <SemanticElement
      {...getDataAttributes(props)}
      className={className}
      tabIndex={-1}
      id={id}
    >
      {children()}
    </SemanticElement>
  );
};

export default ContainerWrapper;
