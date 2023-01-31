import { KeyboardEvent } from 'react';
import { keyCodes } from './a11y';

export type Procedure = (...args: Array<any>) => void;

type KeyboardEventHandler = (event: KeyboardEvent) => void;

export const debounce = (
  fn: Procedure,
  ms = 0,
  { leading = false, trailing = true } = {},
): Procedure => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Array<any>) {
    if (leading && timeoutId === null) {
      fn.apply(this, args);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!trailing || !leading || timeoutId) {
      timeoutId = setTimeout(() => {
        if (trailing) {
          fn.apply(this, args);
        }
        timeoutId = null;
      }, ms);
    } else {
      // Special case for a single call with both leading and trailing (see tests)
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, ms);
    }
  };
};

export const throttle = (func: Procedure, ms = 0): Procedure => {
  let isThrottled = false,
    savedArgs: any;

  function wrapper(this: any, ...args: any) {
    if (isThrottled) {
      savedArgs = args;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(this, savedArgs);
        savedArgs = null;
      }
    }, ms);
  }

  return wrapper;
};

export const isBrowser = () => typeof window !== `undefined`;

export const performOnEnter = (
  fn: (event: KeyboardEvent) => void,
): KeyboardEventHandler => {
  return function (event: KeyboardEvent) {
    if (event.keyCode === keyCodes.enter) {
      fn(event);
    }
  };
};

export const isCSSMaskSupported = () => {
  if (!isBrowser()) {
    return true;
  }

  return (
    window.CSS &&
    window.CSS.supports(
      '(mask-repeat: no-repeat) or (-webkit-mask-repeat: no-repeat)',
    )
  );
};

export const isEmptyObject = (obj: any) =>
  !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);

export type Overwrite<T, U> = Omit<T, keyof U> & U;

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);

type Dataset = Record<string, string>;

export const getDataAttributes = (props: any): Dataset => {
  return Object.entries(props).reduce((acc: Dataset, [key, val]) => {
    if (key.includes('data-')) {
      acc[key] = val as string;
    }
    return acc;
  }, {});
};
