import React from 'react';
import classNames from 'classnames';
import { SkinScreenWidthContainerWrapperProps } from '../SkinScreenWidthContainer';

const WrapperElement: React.FC<
  SkinScreenWidthContainerWrapperProps & {
    skinStyles: Record<string, string>;
  }
> = ({
  id,
  className,
  skinClassName,
  tagName = 'div',
  transition,
  transitionEnded,
  eventHandlers,
  skinStyles,
  children,
  tabIndex,
}) => {
  const SemanticElement = tagName as keyof JSX.IntrinsicElements;

  return (
    <SemanticElement
      id={id}
      className={classNames(
        skinClassName,
        transition && skinStyles[transition],
        transitionEnded && skinStyles.transitionEnded,
        className,
      )}
      tabIndex={tabIndex}
      {...eventHandlers}
    >
      {children}
    </SemanticElement>
  );
};

export default WrapperElement;
