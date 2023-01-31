import * as React from 'react';
import { ITransitionProps } from './transition.types';
import CrossFade from './transitions/CrossFade';
import OutIn from './transitions/OutIn';
import SlideHorizontal from './transitions/SlideHorizontal';
import SlideVertical from './transitions/SlideVertical';

const TransitionsComps = {
  CrossFade,
  OutIn,
  SlideHorizontal,
  SlideVertical,
} as const;

const Transition: React.FC<ITransitionProps> = props => {
  const TransitionComp = TransitionsComps[props.type];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...transitionCompProps } = props;

  return <TransitionComp {...transitionCompProps} />;
};

export default Transition;
