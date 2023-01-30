import * as React from 'react';
import classNames from 'classnames';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import { getDataAttributes } from '../../../core/commons/utils';
import { FiveGridLineProps } from '../FiveGridLine.types';
import semanticClassNames from '../FiveGridLine.semanticClassNames';

type FiveGridLineWrapperProps = Omit<FiveGridLineProps, 'skin'> & {
  className?: string;
};

export const FiveGridLineWrapper: React.FC<
  FiveGridLineWrapperProps
> = props => {
  const {
    id,
    children,
    className,
    customClassNames = [],
    onMouseEnter,
    onMouseLeave,
  } = props;

  return (
    <div
      id={id}
      className={classNames(
        className,
        customCssClasses(semanticClassNames.root, ...customClassNames),
      )}
      {...getDataAttributes(props)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
