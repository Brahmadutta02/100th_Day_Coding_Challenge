import React from 'react';
import skinsStyles from './styles/TransparentScreen.scss';
import BaseScreenSkin, { BaseScreenSkinProps } from './BaseScreenSkin';

const TransparentScreen: React.FC<
  Omit<BaseScreenSkinProps, 'skin' | 'skinStyles'>
> = props => <BaseScreenSkin {...props} skinStyles={skinsStyles} />;

export default TransparentScreen;
