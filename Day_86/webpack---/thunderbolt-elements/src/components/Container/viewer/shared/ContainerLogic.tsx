import * as React from 'react';
import type { TranslationGetter } from '@wix/editor-elements-types/thunderbolt';
import classNames from 'classnames';

import {
  IContainerLogicProps,
  IContainerImperativeActions,
} from '../../Container.types';
import MeshContainer from '../../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import { getAriaAttributes } from '../../../../core/commons/a11y';
import { getDataAttributes } from '../../../../core/commons/utils';
import styles from './common.scss';
import {
  ARIA_LABEL_DEFAULT,
  ARIA_LABEL_KEY,
  ARIA_LABEL_NAMESPACE,
} from './constants';

const getAriaLabel = (translate: TranslationGetter | undefined) => {
  return translate
    ? translate(ARIA_LABEL_NAMESPACE, ARIA_LABEL_KEY, ARIA_LABEL_DEFAULT)
    : ARIA_LABEL_DEFAULT;
};

const ContainerLogicComp: React.ForwardRefRenderFunction<
  IContainerImperativeActions,
  IContainerLogicProps
> = (props, ref) => {
  const {
    id,
    className,
    meshProps,
    renderSlot,
    children,
    onClick,
    onDblClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    translate,
    hasPlatformClickHandler,
    a11y = {},
    ariaAttributes = {},
    tabIndex,
    role,
  } = props;

  const rootElementRef = React.useRef<HTMLDivElement>(null);

  const { 'aria-label-interactions': ariaLabelInteractions, ...a11yAttr } =
    a11y;

  if (ariaLabelInteractions) {
    a11yAttr['aria-label'] = getAriaLabel(translate);
  }

  const meshContainerProps = {
    id,
    children,
    ...meshProps,
  };

  const containerClassName = classNames(className, {
    [styles.clickable]: hasPlatformClickHandler,
  });

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        rootElementRef.current?.focus();
      },
      blur: () => {
        rootElementRef.current?.blur();
      },
    };
  });

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      ref={rootElementRef}
      className={containerClassName}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...a11yAttr}
      {...getAriaAttributes({ ...ariaAttributes, tabIndex, role })}
    >
      {renderSlot({
        containerChildren: <MeshContainer {...meshContainerProps} />,
      })}
    </div>
  );
};

export const ContainerLogic = React.forwardRef(ContainerLogicComp);
