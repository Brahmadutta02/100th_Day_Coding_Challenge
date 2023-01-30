import * as React from 'react';
import { IFormContainerSharedProps } from '../../FormContainer.types';

export type IFormContainerRootProps = IFormContainerSharedProps & {
  className?: string;
  children: React.ReactNode;
};

const FormContainerRoot: React.FC<IFormContainerRootProps> = props => {
  const { id, className, onSubmit, children, onMouseEnter, onMouseLeave } =
    props;

  return (
    <form
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      onSubmit={e => {
        e.preventDefault();
        if (onSubmit) {
          e.persist();
          onSubmit(e);
        }
      }}
    >
      {children}
    </form>
  );
};

export { FormContainerRoot };
