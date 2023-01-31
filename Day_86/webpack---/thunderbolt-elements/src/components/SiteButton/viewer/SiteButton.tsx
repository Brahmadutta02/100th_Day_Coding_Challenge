import * as React from 'react';
import { ElementType } from '../constants';
import {
  ISiteButtonImperativeActions,
  ISiteButtonProps,
} from '../SiteButton.types';
import { isValidLink } from '../../Link/viewer/Link';
import { getQaDataAttributes } from '../../../core/commons/qaUtils';
import { getAriaAttributes } from '../../../core/commons/a11y';
import { getDataAttributes } from '../../../core/commons/utils';

const noop = () => {};

const getTabIndex = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
  isDisabled: boolean,
) => {
  if (isDisabled) {
    return -1;
  }

  if (elementType === ElementType.Button) {
    return undefined;
  }

  if (isEmptyLink(elementType, link)) {
    return 0;
  }

  return undefined;
};

const getRole = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
  isDisabled: boolean,
) =>
  isEmptyLink(elementType, link) || isDisabledLink(elementType, isDisabled)
    ? 'button'
    : undefined;

const isEmptyLink = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
) => elementType === ElementType.Link && !isValidLink(link);

const isDisabledLink = (elementType: ElementType, isDisabled: boolean) =>
  elementType === ElementType.Link && isDisabled;

const SiteButton: React.ForwardRefRenderFunction<
  ISiteButtonImperativeActions,
  ISiteButtonProps
> = (props, ref) => {
  const {
    id,
    className,
    autoFocus,
    label = '',
    skin: ButtonClass,
    hasPlatformClickHandler = false,
    link = undefined,
    ariaLabel,
    isQaMode,
    fullNameCompType,
    onFocus,
    onBlur,
    onClick = noop,
    onDblClick = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
    ariaAttributes,
    a11y = {},
  } = props;
  let { isDisabled = false } = props;

  // TODO - this is a temp workaround for SSR setting isDisabled value as `null`
  if (isDisabled !== true) {
    isDisabled = false;
  }

  const elementType = hasPlatformClickHandler
    ? ElementType.Button
    : ElementType.Link;

  const tabIndex = getTabIndex(elementType, link, isDisabled);
  const role = getRole(elementType, link, isDisabled);

  const a11yProps = getAriaAttributes({
    ...ariaAttributes,
    ...a11y,
    disabled: a11y.disabled ?? isDisabled,
    label: ariaAttributes?.label ?? a11y.label ?? ariaLabel,
  });

  const linkProps = link && {
    href: isDisabled ? undefined : link.href,
    target: link.target,
    rel: link.rel,
    linkPopupId: link.linkPopupId,
    anchorDataId: link.anchorDataId,
    anchorCompId: link.anchorCompId,
    activateByKey: 'Enter',
  };

  return (
    <ButtonClass
      wrapperProps={{
        ...getDataAttributes(props),
        className,
        id,
        role,
        tabIndex,
        'aria-disabled': a11yProps['aria-disabled'],
        onClick: isDisabled ? noop : onClick,
        onDoubleClick: isDisabled ? noop : onDblClick,
        onMouseEnter,
        onMouseLeave,
        ...getQaDataAttributes(isQaMode, fullNameCompType),
      }}
      autoFocus={autoFocus}
      elementType={elementType}
      linkProps={linkProps}
      a11yProps={a11yProps}
      label={label}
      onFocus={isDisabled ? undefined : onFocus}
      onBlur={isDisabled ? undefined : onBlur}
      ref={ref}
    />
  );
};

export default React.forwardRef(SiteButton);
