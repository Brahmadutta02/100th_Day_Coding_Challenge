import React from 'react';
import { TestIds } from '../../../constants';
import { SkinScreenWidthContainerProps } from '../../../SkinScreenWidthContainer';
import WrapperElement from '../../WrapperElement';
import skinStyles from './styles/skins.scss';

const DefaultScreen: React.FC<SkinScreenWidthContainerProps> = ({
  wrapperProps,
  children,
}) => {
  return (
    <WrapperElement
      {...wrapperProps}
      skinClassName={skinStyles.DefaultScreen}
      skinStyles={skinStyles}
    >
      <div className={skinStyles.screenWidthBackground}>
        <div
          className={skinStyles.bg}
          data-testid={TestIds.screenWidthContainerBg}
        />
      </div>
      <div className={skinStyles.centeredContent}>
        <div className={skinStyles.centeredContentBg}>
          <div
            className={skinStyles.bgCenter}
            data-testid={TestIds.screenWidthContainerBgCenter}
          />
        </div>
        <div className={skinStyles.inlineContent}>{children}</div>
      </div>
    </WrapperElement>
  );
};

export default DefaultScreen;
