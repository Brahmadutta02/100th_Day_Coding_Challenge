import React from 'react';
import Page from '../../Page';
import { SkinPageProps } from '../SkinPage';
import skinsStyles from './styles/BasicPageSkin.scss';
import BasePageSkin, { BasePageSkinProps } from './BasePageSkin';

const BasicPageSkin: React.FC<
  Omit<BasePageSkinProps, 'skinsStyle'>
> = props => <BasePageSkin {...props} skinsStyle={skinsStyles} />;

const BasicPage: React.FC<SkinPageProps> = props => (
  <Page {...props} skin={BasicPageSkin} />
);

export default BasicPage;
