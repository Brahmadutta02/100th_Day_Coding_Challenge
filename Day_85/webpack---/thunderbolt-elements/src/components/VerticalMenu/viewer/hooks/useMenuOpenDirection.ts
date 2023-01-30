import { RefObject, useEffect, useState } from 'react';
import { MenuOpenDirection } from '../../VerticalMenu.types';
import { TestIds } from '../constants';
import { debounce, isBrowser } from '../../../../core/commons/utils';

/*
We should change the sub menu direction only if it improves the visibility of the menu items
1. Check if the menu will be visible if it is opened from top
2. Check if the menu will be visible if it is opened from bottom
3. Menu is currently positioned on bottom
      Not fully visible on bottom but fully visible on top
        Change direction to top
4. Menu is currently positioned on top
      Not fully visible on top
        Change direction to bottom (if we "loose" menu items the last ones are less important)
5. None of the above is true?
      Do nothing
*/
const shouldChangeSubMenuDirection = (
  menuOpenDirection: MenuOpenDirection,
  menuItemHeight: number,
) => {
  return (subMenuElem: Element) => {
    const subMenuElemPosition = subMenuElem.getBoundingClientRect();

    let fullyVisibleWhenOpenedFromTop;
    let fullyVisibleWhenOpenedFromBottom;
    if (menuOpenDirection === 'top') {
      fullyVisibleWhenOpenedFromTop =
        subMenuElemPosition.height <= subMenuElemPosition.bottom;
      fullyVisibleWhenOpenedFromBottom =
        subMenuElemPosition.height <=
        subMenuElemPosition.bottom +
          menuItemHeight +
          document.documentElement.clientHeight;
    }
    // menuOpenDirection === 'bottom'
    else {
      fullyVisibleWhenOpenedFromBottom =
        subMenuElemPosition.top + subMenuElemPosition.height <=
        document.documentElement.clientHeight;
      fullyVisibleWhenOpenedFromTop =
        subMenuElemPosition.height <= subMenuElemPosition.top + menuItemHeight;
    }

    if (
      menuOpenDirection === 'bottom' &&
      !fullyVisibleWhenOpenedFromBottom &&
      fullyVisibleWhenOpenedFromTop
    ) {
      return true;
    } else if (menuOpenDirection === 'top' && !fullyVisibleWhenOpenedFromTop) {
      return true;
    } else {
      return false;
    }
  };
};

export default function useMenuOpenDirection(
  navRef: RefObject<HTMLElement>,
  menuItemHeight: number,
): MenuOpenDirection {
  const [menuOpenDirection, setMenuOpenDirection] =
    useState<MenuOpenDirection>('bottom');

  const updateMenuOpenDirection = () => {
    setMenuOpenDirection(currentMenuOpenDirection => {
      if (!navRef.current) {
        return currentMenuOpenDirection;
      }

      const subMenus = navRef.current.querySelectorAll(
        `[id^=${TestIds.subMenuPrefix}]`,
      );

      const changeSubMenuDirection = Array.from(subMenus).every(
        shouldChangeSubMenuDirection(currentMenuOpenDirection, menuItemHeight),
      );

      if (currentMenuOpenDirection === 'bottom' && changeSubMenuDirection) {
        return 'top';
      } else if (currentMenuOpenDirection === 'top' && changeSubMenuDirection) {
        return 'bottom';
      } else {
        return currentMenuOpenDirection;
      }
    });
  };

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    const debouncedHandler = debounce(updateMenuOpenDirection, 300);

    window.addEventListener('resize', debouncedHandler);
    updateMenuOpenDirection();
    return () => window.removeEventListener('resize', debouncedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return menuOpenDirection;
}
