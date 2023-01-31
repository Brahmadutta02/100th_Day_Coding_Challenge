import * as React from 'react';
import cx from 'classnames';
import { IAppWidgetProps } from '../AppWidget.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import { getDataAttributes } from '../../../core/commons/utils';
import style from './style/AppWidget.scss';

/**
 * TODO - how should the scrollMixin be migrated? and the overflowWrapperMixin?
 * TODO - consider using uiType here to separate the loader skin
 */
const AppWidget: React.FC<IAppWidgetProps> = props => {
  const { id, skin = 'AppWidgetSkin', children, meshProps, className } = props;
  const meshContainerProps = {
    id,
    ...meshProps,
  };

  const shouldShowLoader = skin === 'AppWidgetLoaderSkin';

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={cx(
        style.root,
        {
          [style.loading]: shouldShowLoader,
        },
        className,
      )}
    >
      {shouldShowLoader ? (
        <div role="alert" aria-busy="true" className={style.preloader} />
      ) : (
        <MeshContainer {...meshContainerProps}>{children}</MeshContainer>
      )}
    </div>
  );
};

export default AppWidget;
