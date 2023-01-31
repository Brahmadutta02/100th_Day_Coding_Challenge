import * as React from 'react';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { IPageGroupProps } from '../PageGroup.types';
import GroupContent from '../../commons/viewer/GroupContent';
import { TRANSITION_GROUP_ID } from '../../commons/constants';
import { getDataAttributes } from '../../../../core/commons/utils';
import style from './style/style.scss';

const GroupContentMemo = React.memo(GroupContent, (__, nextProps) => {
  return !(nextProps.children()! as Array<ReactNode>).length;
});

const PageGroup: React.FC<IPageGroupProps> = props => {
  const { id, children, className, ...restProps } = props;

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(style.pageGroupWrapper, className)}
    >
      <GroupContentMemo
        id={`${id}_${TRANSITION_GROUP_ID}`}
        className={style.pageGroup}
        {...restProps}
      >
        {children}
      </GroupContentMemo>
    </div>
  );
};

export default PageGroup;
