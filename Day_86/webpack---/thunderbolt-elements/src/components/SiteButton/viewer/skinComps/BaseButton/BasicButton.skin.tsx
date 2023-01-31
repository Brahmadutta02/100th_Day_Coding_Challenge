import * as React from 'react';
import SiteButton from '../../SiteButton';
import { SkinButtonProps } from '../SkinButton.types';
import {
  ISiteButtonImperativeActions,
  ISiteButtonProps,
} from '../../../SiteButton.types';
import BaseButtonSkin from './BaseButton';
import skinsStyle from './styles/BasicButton.scss';

const BasicButtonSkin = React.forwardRef<
  ISiteButtonImperativeActions,
  SkinButtonProps
>((props, ref) => (
  <BaseButtonSkin {...props} skinsStyle={skinsStyle} ref={ref}></BaseButtonSkin>
));

const BasicButton: React.ForwardRefRenderFunction<
  ISiteButtonImperativeActions,
  Omit<ISiteButtonProps, 'skin'>
> = (props, ref) => <SiteButton {...props} skin={BasicButtonSkin} ref={ref} />;

export default React.forwardRef(BasicButton);
