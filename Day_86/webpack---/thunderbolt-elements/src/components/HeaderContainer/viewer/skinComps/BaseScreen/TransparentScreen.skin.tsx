import React from 'react';
import { IHeaderContainerProps } from '../../../HeaderContainer.types';
import TransparentScreen from '../../../../ScreenWidthContainer/viewer/skinComps/BaseScreen/TransparentScreen';
import HeaderContainer from '../../HeaderContainer';

const TransparentScreenHeader: React.FC<
  Omit<IHeaderContainerProps, 'skin'>
> = props => (
  <HeaderContainer {...props} skin={TransparentScreen}></HeaderContainer>
);

export default TransparentScreenHeader;
