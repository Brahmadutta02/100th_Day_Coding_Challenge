import classNames from 'classnames';
import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import MeshContainer from '../../MeshContainer/viewer/MeshContainer';
import { IMeshGroupProps } from '../MeshGroup';

const MeshGroup: React.FC<IMeshGroupProps> = props => {
  const { id, meshProps, children, className, carmiClassName = '' } = props;
  return (
    <div
      id={id}
      className={classNames(className, carmiClassName)}
      {...getDataAttributes(props)}
    >
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </div>
  );
};

export default MeshGroup;
