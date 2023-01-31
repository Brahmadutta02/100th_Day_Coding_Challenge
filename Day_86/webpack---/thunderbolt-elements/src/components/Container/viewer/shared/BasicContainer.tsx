import * as React from 'react';
import classnames from 'classnames';
import {
  ISkinableContainerProps,
  IContainerImperativeActions,
} from '../../Container.types';
import { ContainerLogic } from './ContainerLogic';
import { TestIds } from './constants';

/** This is a shared dom structure for similar skins */
const BasicContainerComp: React.ForwardRefRenderFunction<
  IContainerImperativeActions,
  ISkinableContainerProps
> = ({ classes, className, ...rest }, ref) => {
  return (
    <ContainerLogic
      {...rest}
      ref={ref}
      className={classnames(classes.root, className)}
      renderSlot={({ containerChildren }) => (
        <>
          <div className={classes.bg} data-testid={TestIds.BG} />
          {containerChildren}
        </>
      )}
    />
  );
};

export const BasicContainer = React.forwardRef(BasicContainerComp);
