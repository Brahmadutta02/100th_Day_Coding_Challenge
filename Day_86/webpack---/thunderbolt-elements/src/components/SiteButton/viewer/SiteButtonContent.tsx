import React, { ForwardRefRenderFunction, ReactNode, RefObject } from 'react';
import classnames from 'classnames';
import type { IFocusPropsSDKActions } from '@wix/editor-elements-corvid-utils';
import Link from '../../Link/viewer/Link';
import { TestIds, ElementType } from '../constants';
import { ISiteButtonImperativeActions } from '../SiteButton.types';
import {
  activateBySpaceOrEnterButton,
  AriaAttributes,
} from '../../../core/commons/a11y';
import { SkinButtonProps } from './skinComps/SkinButton.types';
import styles from './SiteButtonContent.scss';

export type SiteButtonContentCompProps = {
  linkProps: SkinButtonProps['linkProps'];
  a11yProps: Partial<AriaAttributes>;
  elementType: SkinButtonProps['elementType'];
  className: string;
  children: ReactNode;
  autoFocus?: boolean;
  disabled?: boolean;
} & IFocusPropsSDKActions;

const SiteButtonContent: ForwardRefRenderFunction<
  ISiteButtonImperativeActions,
  SiteButtonContentCompProps
> = (
  {
    elementType,
    linkProps,
    a11yProps,
    className,
    children,
    autoFocus,
    onBlur,
    onFocus,
    disabled,
  },
  ref,
) => {
  const buttonRef = React.useRef<
    HTMLAnchorElement | HTMLDivElement | HTMLButtonElement
  >(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
  }));

  const buttonClassName = classnames(className, styles['site-button-content']);

  switch (elementType) {
    case ElementType.Link:
      return (
        <Link
          {...(linkProps || {})}
          {...a11yProps}
          className={buttonClassName}
          ref={buttonRef as RefObject<HTMLAnchorElement | HTMLDivElement>}
          data-testid={TestIds.linkElement}
          onFocusCapture={onFocus}
          onBlurCapture={onBlur}
        >
          {children}
        </Link>
      );
    case ElementType.Button:
      return (
        <button
          {...a11yProps}
          ref={buttonRef as RefObject<HTMLButtonElement>}
          data-testid={TestIds.buttonElement}
          className={buttonClassName}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          onKeyDown={activateBySpaceOrEnterButton}
        >
          {children}
        </button>
      );
    default:
      return null;
  }
};

export default React.forwardRef(SiteButtonContent);
