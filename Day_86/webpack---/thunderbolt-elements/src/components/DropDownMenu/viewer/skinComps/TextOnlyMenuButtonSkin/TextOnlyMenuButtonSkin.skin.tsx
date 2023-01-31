import * as React from 'react';
import type {
  IDropDownMenuProps,
  IDropDownMenuImperativeActions,
} from '../../../DropDownMenu.types';
import DropDownMenuBase from '../../DropDownMenuBase';
import MenuButton from '../../../../MenuButton/viewer/skinComps/BaseButton/TextOnlyMenuButtonNSkin';
import styles from './TextOnlyMenuButtonSkin.scss';

const TextOnlyMenuButtonSkin: React.ForwardRefRenderFunction<
  IDropDownMenuImperativeActions,
  IDropDownMenuProps
> = (props, ref) => {
  return (
    <DropDownMenuBase
      {...props}
      ref={ref}
      styles={styles}
      Button={MenuButton}
    />
  );
};

export default React.forwardRef(TextOnlyMenuButtonSkin);
