import * as React from 'react';
import SiteButton from '../../SiteButton';
import { SkinButtonProps } from '../SkinButton.types';
import {
  ISiteButtonImperativeActions,
  ISiteButtonProps,
} from '../../../SiteButton.types';
import BaseButtonSkin from './BaseButton';
import skinsStyle from './styles/TextOnlyButtonSkin.scss';

const TextOnlyButtonSkinSkin = React.forwardRef<
  ISiteButtonImperativeActions,
  SkinButtonProps
>((props, ref) => (
  <BaseButtonSkin {...props} skinsStyle={skinsStyle} ref={ref}></BaseButtonSkin>
));

const TextOnlyButtonSkin: React.ForwardRefRenderFunction<
  ISiteButtonImperativeActions,
  Omit<ISiteButtonProps, 'skin'>
> = (props, ref) => (
  <SiteButton {...props} skin={TextOnlyButtonSkinSkin} ref={ref} />
);

export default React.forwardRef(TextOnlyButtonSkin);
