import React, { ReactElement, useCallback } from 'react';
import classNames from 'classnames';
import { IResponsiveContainerProps } from '../ResponsiveContainer.types';
import { TestIds } from '../constants';

const OverflowWrapper: React.FC<{ className: string }> = ({
  children,
  className,
}) => (
  <div className={className} tabIndex={0} data-testid={TestIds.overflow}>
    {children}
  </div>
);

const ResponsiveContainer: React.FC<IResponsiveContainerProps> = ({
  containerLayoutClassName,
  overlowWrapperClassName,
  hasOverflow,
  shouldOmitWrapperLayers,
  children,
  role,
  extraRootClass = '',
}) => {
  const wrapWithOverflowWrapperIfNeeded = useCallback(
    (reactChildren: ReactElement) =>
      !shouldOmitWrapperLayers && hasOverflow ? (
        <OverflowWrapper
          className={classNames(overlowWrapperClassName, extraRootClass)}
        >
          {reactChildren}
        </OverflowWrapper>
      ) : (
        reactChildren
      ),
    [
      extraRootClass,
      hasOverflow,
      overlowWrapperClassName,
      shouldOmitWrapperLayers,
    ],
  );

  return wrapWithOverflowWrapperIfNeeded(
    shouldOmitWrapperLayers ? (
      <React.Fragment>{children()}</React.Fragment>
    ) : (
      <div
        className={
          hasOverflow
            ? containerLayoutClassName
            : classNames(containerLayoutClassName, extraRootClass)
        }
        data-testid={TestIds.content}
        {...(role ? { role } : {})}
      >
        {children()}
      </div>
    ),
  );
};

export default ResponsiveContainer;
