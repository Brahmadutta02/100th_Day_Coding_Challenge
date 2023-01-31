import * as React from 'react';
import WrapperElement from '../../WrapperElement';
import { SkinScreenWidthContainerProps } from '../../../SkinScreenWidthContainer';

export type BaseScreenSkinProps = SkinScreenWidthContainerProps & {
  skinStyles: Record<string, string>;
};

const BaseScreen: React.FC<BaseScreenSkinProps> = ({
  wrapperProps,
  children,
  skinStyles,
}) => {
  return (
    <WrapperElement
      {...wrapperProps}
      skinClassName={skinStyles.root}
      skinStyles={skinStyles}
    >
      <div className={skinStyles.screenWidthBackground}></div>
      <div className={skinStyles.centeredContent}>
        <div className={skinStyles.centeredContentBg}></div>
        <div className={skinStyles.inlineContent}>{children}</div>
      </div>
    </WrapperElement>
  );
};

export default BaseScreen;
