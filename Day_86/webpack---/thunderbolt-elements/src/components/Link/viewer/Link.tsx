import * as React from 'react';
import { TestIds } from '../constants';
import { LinkProps } from '../Link.types';
import {
  activateByEnterButton,
  activateBySpaceButton,
  activateBySpaceOrEnterButton,
} from '../../../core/commons/a11y';
import { getDataAttributes } from '../../../core/commons/utils';

// If connected to popup, open with either space or enter keys
const getDefaultActivateByKey = (linkPopupId: string | undefined) =>
  linkPopupId ? 'SpaceOrEnter' : 'Space';

export type LinkRef = HTMLAnchorElement | HTMLDivElement;

const Link: React.ForwardRefRenderFunction<LinkRef, LinkProps> = (
  props,
  ref,
) => {
  const {
    href,
    role,
    target,
    rel,
    className = '',
    children,
    linkPopupId,
    anchorDataId,
    anchorCompId,
    tabIndex,
    dataTestId = TestIds.root,
    title,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    onFocusCapture,
    onBlurCapture,
    'aria-live': ariaLive,
    'aria-disabled': ariaDisabled,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-pressed': ariaPressed,
    'aria-expanded': ariaExpended,
    'aria-describedby': ariaDescribedBy,
    'aria-haspopup': ariaHasPopup,
  } = props;

  const activateByKey =
    props.activateByKey !== undefined
      ? props.activateByKey
      : getDefaultActivateByKey(linkPopupId);

  let onKeyDown;
  switch (activateByKey) {
    case 'Enter':
      onKeyDown = activateByEnterButton;
      break;
    case 'Space':
      onKeyDown = activateBySpaceButton;
      break;
    case 'SpaceOrEnter':
      onKeyDown = activateBySpaceOrEnterButton;
      break;
    default:
      onKeyDown = undefined;
      break;
  }

  // eslint-disable-next-line jsx-a11y/role-supports-aria-props
  return href !== undefined ? (
    <a
      {...getDataAttributes(props)}
      data-testid={dataTestId}
      data-popupid={linkPopupId}
      data-anchor={anchorDataId}
      data-anchor-comp-id={anchorCompId}
      href={href || undefined}
      target={target}
      role={linkPopupId ? 'button' : role}
      rel={rel}
      className={className}
      onKeyDown={onKeyDown}
      aria-live={ariaLive}
      aria-disabled={ariaDisabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpended}
      aria-haspopup={ariaHasPopup}
      aria-describedby={ariaDescribedBy}
      title={title}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      ref={ref as React.MutableRefObject<HTMLAnchorElement>}
      tabIndex={linkPopupId ? 0 : tabIndex}
    >
      {children}
    </a>
  ) : (
    <div
      {...getDataAttributes(props)}
      data-testid={dataTestId}
      className={className}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-haspopup={ariaHasPopup}
      aria-disabled={ariaDisabled}
      title={title}
      role={role}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref as React.MutableRefObject<HTMLDivElement>}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(Link);

export const isValidLink = (link?: LinkProps): boolean => {
  return Boolean(link && (link.href || link.linkPopupId));
};
