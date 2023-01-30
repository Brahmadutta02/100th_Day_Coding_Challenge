import * as React from 'react';
import {
  IContainerProps,
  IContainerImperativeActions,
} from '../../../Container.types';
import { BasicContainer } from '../../shared/BasicContainer';
import styles from './DefaultAreaSkin.scss';

const DefaultAreaSkin: React.ForwardRefRenderFunction<
  IContainerImperativeActions,
  IContainerProps
> = (props, ref) => {
  return <BasicContainer ref={ref} {...props} classes={styles} />;
};

export default React.forwardRef(DefaultAreaSkin);
