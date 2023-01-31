import * as React from 'react';
import { ReactElement } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { IGroupContentProps } from '../commons.types';
import Transition from '../../../Transition/Transition';
import { TRANSITION_GROUP_ID } from '../constants';
import { getDataAttributes } from '../../../../core/commons/utils';

const GroupContent: React.FC<IGroupContentProps> = props => {
  const {
    id = TRANSITION_GROUP_ID,
    transition = 'none',
    transitionDuration = 0,
    transitionEnabled = true,
    onTransitionComplete = () => {},
    onTransitionStarting = () => {},
    className,
    children,
  } = props;
  const childrenArray = React.Children.toArray(children());
  const child = childrenArray[0] as ReactElement;
  const childId = child?.props.id;

  const reverse = transition === 'SlideVertical';

  const content =
    transition === 'none' ? (
      children()
    ) : (
      <TransitionGroup
        id={id}
        {...getDataAttributes(props)}
        className={className}
        childFactory={_child => React.cloneElement(_child, { reverse })}
      >
        <Transition
          type={transition}
          key={childId}
          timeout={transitionDuration}
          onEntered={onTransitionComplete}
          onExiting={onTransitionStarting}
          enter={transitionEnabled}
          exit={transitionEnabled}
          unmountOnExit
        >
          {() => child}
        </Transition>
      </TransitionGroup>
    );

  return <>{content}</>;
};

export default GroupContent;
