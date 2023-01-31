import { useRef, useEffect } from 'react';
import { activateBySpaceOrEnterButton } from '../../../../../core/commons/a11y';

/** Allows opening popup links passed in html with Space and Enter keys
 * @param htmlWrapperRef: ref pointing to a container with link elements
 * @param deps: dependency array, re-triggers effect on change
 */
export function usePopupLinkEvents(
  htmlWrapperRef: React.RefObject<HTMLElement>,
  deps: Array<any> = [],
) {
  // Array of popup links with attached event listeners
  const trackedLinkElementsRef = useRef<Array<HTMLAnchorElement>>([]);

  const clearPopupLinkListeners = () =>
    trackedLinkElementsRef.current.forEach(linkWithPopup => {
      linkWithPopup.removeEventListener(
        'keydown',
        // @ts-expect-error addEventListener doesn't recognize keydown as keyboard event
        activateBySpaceOrEnterButton,
      );
    });

  useEffect(() => {
    // Remove old event listeners
    clearPopupLinkListeners();

    const linkWithPopupSelector = 'a[data-popupid]';
    const popupLinkElements = Array.from(
      htmlWrapperRef.current?.querySelectorAll(linkWithPopupSelector) || [],
    );

    popupLinkElements.forEach(linkWithPopup => {
      // @ts-expect-error addEventListener doesn't recognize keydown as keyboard event
      linkWithPopup.addEventListener('keydown', activateBySpaceOrEnterButton);
    });

    trackedLinkElementsRef.current =
      popupLinkElements as Array<HTMLAnchorElement>;

    // Remove all listeners on unmount
    return clearPopupLinkListeners;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
