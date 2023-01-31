import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import { IFooterContainerProps } from '../FooterContainer.types';

const DEFAULT_TAB_INDEX = '-1';

const FooterContainer: React.FC<IFooterContainerProps> = props => {
  const {
    id,
    className,
    skin: FooterContainerClass,
    children,
    meshProps,
  } = props;

  const sdkEventHandlers = {
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onClick: props.onClick,
    onDoubleClick: props.onDblClick,
  };

  return (
    <FooterContainerClass
      wrapperProps={{
        ...getDataAttributes(props),
        id,
        eventHandlers: sdkEventHandlers,
        tabIndex: DEFAULT_TAB_INDEX,
        className,
      }}
    >
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </FooterContainerClass>
  );
};

export default FooterContainer;
