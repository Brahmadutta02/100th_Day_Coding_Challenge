// shamelessly stolen form https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
import { useRef, useLayoutEffect, useEffect } from 'react';
import { isBrowser } from '../../core/commons/utils';

export type Pos = { x: number; y: number; isAtPageBottom: boolean };

function getScrollPosition(): Pos {
  if (!isBrowser()) {
    return { x: 0, y: 0, isAtPageBottom: false };
  }

  const { left, top } = document.body.getBoundingClientRect();
  const isAtPageBottom =
    window.innerHeight + window.scrollY === document.body.scrollHeight;
  return { x: left, y: top, isAtPageBottom };
}

export type useScrollPositionOptions = {
  waitFor?: number;
  disabled?: boolean;
};

export function useScrollPosition(
  effect: ({ prevPos, currPos }: { prevPos: Pos; currPos: Pos }) => void,
  deps: Array<any>,
  options: useScrollPositionOptions = {},
) {
  options = {
    waitFor: 100,
    disabled: false,
    ...options,
  };

  const position = useRef(getScrollPosition());
  let throttleTimeout: number | null = null;
  const callBack = () => {
    const currPos = getScrollPosition();
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout = null;
  };
  const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    if (!isBrowser()) {
      return;
    }
    const handleScroll = () => {
      if (throttleTimeout === null) {
        throttleTimeout = window.setTimeout(callBack, options.waitFor);
      }
    };

    if (!options.disabled) {
      window.addEventListener('scroll', handleScroll);
      const cleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        if (throttleTimeout) {
          window.clearTimeout(throttleTimeout);
        }
      };
      return cleanup;
    }
    return () => {};
  }, deps);
}
