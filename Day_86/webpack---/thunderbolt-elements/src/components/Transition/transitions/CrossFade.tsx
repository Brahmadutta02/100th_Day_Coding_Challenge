import { CSSTransition } from 'react-transition-group';
import * as React from 'react';
import styles from '../styles/CrossFade.scss';
import { CustomTransitionProps } from '../transition.types';

const CrossFade: React.FC<CustomTransitionProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reverse, ...cssTransitionProps } = props;

  return (
    <CSSTransition
      // <TransitionGroup> passes transition props to his immediate child so we have to pass all props when wrapping <CSSTransition>
      {...cssTransitionProps}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
    >
      {props.children}
    </CSSTransition>
  );
};

export default CrossFade;
