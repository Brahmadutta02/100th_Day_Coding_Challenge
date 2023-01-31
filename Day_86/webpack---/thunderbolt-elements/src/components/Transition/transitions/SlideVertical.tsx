import { CSSTransition } from 'react-transition-group';
import * as React from 'react';
import styles from '../styles/SlideVertical.scss';
import { CustomTransitionProps } from '../transition.types';

const SlideVertical: React.FC<CustomTransitionProps> = props => {
  const { reverse, ...cssTransitionProps } = props;

  return (
    <CSSTransition
      // <TransitionGroup> passes transition props to his immediate child so we have to pass all props when wrapping <CSSTransition>
      {...cssTransitionProps}
      classNames={
        reverse
          ? {
              enter: styles.enterReverse,
              enterActive: styles.enterActiveReverse,
              exit: styles.exitReverse,
              exitActive: styles.exitActiveReverse,
            }
          : {
              enter: styles.enter,
              enterActive: styles.enterActive,
              exit: styles.exit,
              exitActive: styles.exitActive,
            }
      }
    >
      {props.children}
    </CSSTransition>
  );
};

export default SlideVertical;
