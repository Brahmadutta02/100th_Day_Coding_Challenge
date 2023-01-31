import * as React from 'react';
import { MenuButtonProps } from '../../../MenuButton.types';
import BaseButton from './BaseButton';
import skinsStyle from './styles/TextOnlyMenuButtonNSkin.scss';

const TextOnlyMenuButtonNSkin: React.FC<MenuButtonProps> = props => {
  return (
    <BaseButton
      {...props}
      skinsStyle={skinsStyle}
      skin="TextOnlyMenuButtonNSkin"
    />
  );
};

export default TextOnlyMenuButtonNSkin;
