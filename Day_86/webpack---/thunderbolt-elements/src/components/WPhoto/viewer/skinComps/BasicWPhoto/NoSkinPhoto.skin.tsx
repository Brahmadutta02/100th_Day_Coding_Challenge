import * as React from 'react';
import WPhoto from '../../WPhotoBase';
import { SkinWPhotoProps } from '../SkinWPhoto';
import { BaseWPhotoSkinProps } from '../../../WPhoto.types';
import skinsStyles from './styles/NoSkinPhoto.scss';
import BasicWPhotoSkin from './BasicWPhotoSkin';

const NoSkinPhotoSkin: React.FC<
  Omit<BaseWPhotoSkinProps, 'skinsStyle'>
> = props => <BasicWPhotoSkin {...props} skinsStyle={skinsStyles} />;

const NoSkinPhoto: React.FC<SkinWPhotoProps> = props => (
  <WPhoto {...props} skin={NoSkinPhotoSkin} />
);

export default NoSkinPhoto;
