import classNames from 'classnames';
import * as React from 'react';
import { ISiteButtonImperativeActions } from '../../../SiteButton.types';
import SiteButtonContent from '../../SiteButtonContent';
import { SkinButtonProps } from '../SkinButton.types';

type BaseButtonSkinProps = SkinButtonProps & {
  skinsStyle: Record<string, string>;
};

const BaseButtonSkin: React.ForwardRefRenderFunction<
  ISiteButtonImperativeActions,
  BaseButtonSkinProps
> = (
  {
    wrapperProps,
    linkProps,
    a11yProps,
    elementType,
    skinsStyle,
    label,
    autoFocus,
    onFocus,
    onBlur,
  },
  ref,
) => {
  return (
    <div
      {...wrapperProps}
      className={classNames(wrapperProps.className, skinsStyle.root)}
    >
      <SiteButtonContent
        disabled={a11yProps['aria-disabled'] ? true : undefined}
        linkProps={linkProps}
        a11yProps={a11yProps}
        elementType={elementType}
        className={skinsStyle.link}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={ref}
      >
        <span className={skinsStyle.label}>{label}</span>
      </SiteButtonContent>
    </div>
  );
};

export default React.forwardRef(BaseButtonSkin);
