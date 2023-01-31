import * as React from 'react';
import classnames from 'classnames';
import MenuButtonLink from '../../MenuButtonLink';
import MenuButtonBackground from '../../MenuButtonBackground';
import { MenuButtonProps } from '../../../MenuButton.types';
import MenuButtonRoot from '../../MenuButtonRoot';

type BaseButtonProps = MenuButtonProps & {
  skinsStyle: any;
  skin:
    | 'LinesMenuButtonNBorderRadiusFixSkin'
    | 'LinesMenuButtonNSkin'
    | 'RibbonsMenuButtonNSkin'
    | 'SloppyBorderMenuButtonNSkin'
    | 'SolidColorMenuButtonNSkin'
    | 'TextOnlyMenuButtonNSkin'
    | 'TextSeparatorsMenuButtonNSkin';
};

const BaseButton: React.FC<BaseButtonProps> = props => {
  const {
    id,
    isDropDownButton,
    'aria-haspopup': ariaHasPopup,
    'aria-describedby': ariaDescribedBy,
    isMoreButton,
    dir,
    textAlign,
    positionInList,
    link,
    skinsStyle,
    skin,
  } = props;

  return (
    <MenuButtonRoot
      {...props}
      className={classnames(props.className, skinsStyle[skin])}
    >
      {label => (
        <MenuButtonLink
          wrapperProps={{
            positionInList,
            ariaHasPopup: isDropDownButton ? ariaHasPopup : 'false',
            ariaDescribedBy,
            isMoreButton,
          }}
          link={link}
          className={skinsStyle.linkElement}
        >
          <div className={skinsStyle.wrapper}>
            <MenuButtonBackground
              wrapperProps={{ dir, textAlign, id }}
              classNames={{ bg: skinsStyle.bg, label: skinsStyle.label }}
            >
              {label}
            </MenuButtonBackground>
          </div>
        </MenuButtonLink>
      )}
    </MenuButtonRoot>
  );
};

export default BaseButton;
