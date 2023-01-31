import React, { useState, useEffect } from 'react';

import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import { IHeaderContainerProps } from '../HeaderContainer.types';
import { useScrollPosition } from '../../../providers/useScrollPosition';
import { WrapperEventHandlers } from '../../ScreenWidthContainer/SkinScreenWidthContainer';

const TRANSITION_DURATION = 200;
const REVERSE_TRANSITION_SUFFIX = 'Reverse';
const DEFAULT_TAB_INDEX = '-1';

const isReverseTransition = (transitionName: string) =>
  transitionName.endsWith(REVERSE_TRANSITION_SUFFIX);
const getReverseTransitionName = (transitionName: string) =>
  `${transitionName}${REVERSE_TRANSITION_SUFFIX}`;

const ScrollDirection = {
  up: 'up',
  down: 'down',
} as const;
const MOBILEVIEW = 'mobile';

const getAnimationStartThresholdForMobile = () => {
  // start animation immediately, don't wait for certain scroll position
  return 1;
};

const getAnimationStartThresholdForDesktop = (animation: string) => {
  switch (animation) {
    case 'HeaderFadeOut':
      return 200;
    case 'HeaderHideToTop':
      return 400;
    default:
      return null;
  }
};

const HeaderContainer: React.FC<IHeaderContainerProps> = props => {
  const {
    id,
    skin: HeaderContainerClass,
    children,
    animations,
    meshProps,
    className,
  } = props;

  const [transitionName, setTransitionName] = useState<string>('');
  const [transitionEnded, setTransitionEnded] = useState(false);

  const startTransition = (newTransition: string) => {
    setTransitionName(newTransition);
    setTransitionEnded(false);
  };

  useEffect(() => {
    /** If browser doesn't support `ontransitionend`
     * manually set transition ended after transition duration */
    if (!window.TransitionEvent) {
      setTimeout(() => setTransitionEnded(true), TRANSITION_DURATION);
    }
  }, [transitionName]);

  const isHidden = transitionName && !isReverseTransition(transitionName);

  // show header by running animation
  const showHeader = () => {
    const reverseTransitionName = getReverseTransitionName(transitionName);
    startTransition(reverseTransitionName);
  };

  const sdkEventHandlers: WrapperEventHandlers = {
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onClick: props.onClick,
    onDoubleClick: props.onDblClick,
    onFocus: isHidden ? showHeader : undefined,
    onTransitionEnd: () => setTransitionEnded(true),
  };

  let direction: typeof ScrollDirection[keyof typeof ScrollDirection] =
    ScrollDirection.down;
  let directionFlipPosition = 0;

  const updateScrollDirection = (
    currentPosition: number,
    prevPosition: number,
  ) => {
    // catch scroll direction change and record scroll flip position
    // directionFlipPosition defaults to 0 (top of the page), but if we flip scroll direction,
    // this will be the new directionFlipPosition, from which we calculate when to start animation
    if (direction === ScrollDirection.down && currentPosition < prevPosition) {
      directionFlipPosition = prevPosition;
      direction = ScrollDirection.up;
    } else if (
      direction === ScrollDirection.up &&
      currentPosition > prevPosition &&
      currentPosition >= 0 &&
      prevPosition >= 0 // ignore direction flip outside scrollport, otherwise with rubber scroll on Safari header disappears at the top of the page
    ) {
      directionFlipPosition = prevPosition;
      direction = ScrollDirection.down;
    }
  };

  useScrollPosition(
    ({ currPos, prevPos }) => {
      // multiply by -1 if not zero (-0 is confusing during debug)
      const currentPosition = currPos.y && currPos.y * -1;
      const prevPosition = prevPos.y && prevPos.y * -1;

      const lastAnimation = animations[animations.length - 1];
      const lastTransition =
        lastAnimation.params?.animations?.[
          lastAnimation.params.animations.length - 1
        ];

      if (!lastTransition) {
        return;
      }

      const animationStartThreshold =
        lastAnimation.viewMode?.toLowerCase() === MOBILEVIEW
          ? getAnimationStartThresholdForMobile()
          : getAnimationStartThresholdForDesktop(lastTransition.name);
      if (animationStartThreshold) {
        updateScrollDirection(currentPosition, prevPosition);

        if (isHidden) {
          if (
            // we have scrolled far enough from the position where scroll direction was flipped or we are at the top of the page
            (direction === ScrollDirection.up &&
              currentPosition + animationStartThreshold <
                directionFlipPosition) ||
            currPos.y === 0 // make sure header is always visible at the top of the page. Due to rubber scroll on Safari it may disappear after overscroll
          ) {
            showHeader();
          }
        } else if (
          // we have scrolled far enough from the position where scroll direction was flipped
          direction === ScrollDirection.down &&
          currentPosition - directionFlipPosition >= animationStartThreshold
        ) {
          // hide header by running amimation
          startTransition(lastTransition.name);
        }
      }
    },
    [transitionName, animations],
    { disabled: !animations || !animations.length },
  );

  return (
    <HeaderContainerClass
      wrapperProps={{
        id,
        eventHandlers: sdkEventHandlers,
        className,
        transition: transitionName,
        transitionEnded,
        tabIndex: DEFAULT_TAB_INDEX,
      }}
    >
      <MeshContainer id={id} {...meshProps} children={children} />
    </HeaderContainerClass>
  );
};

export default HeaderContainer;
