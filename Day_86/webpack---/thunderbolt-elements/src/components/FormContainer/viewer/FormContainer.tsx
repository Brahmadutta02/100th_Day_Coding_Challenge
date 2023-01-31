import * as React from 'react';
import classnames from 'classnames';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import { IFormContainerProps } from '../FormContainer.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import semanticClassNames from '../FormContainer.semanticClassNames';
import { FormContainerRoot } from './shared/FormContainerRoot';
import styles from './styles/FormContainer.scss';

const FormContainerSkin: React.FC<IFormContainerProps> = props => {
  const {
    id,
    meshProps,
    onSubmit,
    children,
    onMouseEnter,
    onMouseLeave,
    inlineBorder,
    className,
    customClassNames = [],
  } = props;

  const meshContainerProps = {
    id,
    ...meshProps,
    children,
  };

  return (
    <FormContainerRoot
      id={id}
      className={classnames(
        inlineBorder ? '' : styles.root,
        className,
        customCssClasses(semanticClassNames.root, ...customClassNames),
      )}
      onSubmit={onSubmit}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {inlineBorder && (
        <div className={classnames(styles.root, styles.border)} />
      )}
      <MeshContainer {...meshContainerProps} />
    </FormContainerRoot>
  );
};

export default FormContainerSkin;
