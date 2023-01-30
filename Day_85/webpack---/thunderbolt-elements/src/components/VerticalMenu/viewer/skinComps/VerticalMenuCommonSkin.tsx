import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import type {
  VerticalMenuImperativeActions,
  VerticalMenuProps,
  VerticalMenuItem,
  LogicProps,
} from '../../VerticalMenu.types';
import { TestIds } from '../constants';
import useMenuOpenDirection from '../hooks/useMenuOpenDirection';
import Link, { isValidLink } from '../../../Link/viewer/Link';
import { shouldHighlightItem } from '../utils/itemsUtils';
import { getDataAttributes } from '../../../../core/commons/utils';
import semanticClassNames from '../../VerticalMenu.semanticClassNames';

const safeBlur = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const VerticalMenuCommonSkin: React.ForwardRefRenderFunction<
  VerticalMenuImperativeActions,
  VerticalMenuProps & LogicProps
> = props => {
  const {
    items,
    skin,
    id,
    className,
    customClassNames = [],
    ariaLabel,
    menuItemHeight,
    style,
    separatedButton,
    subMenuOpenSide,
    onMouseEnter,
    onMouseLeave,
    onItemClick,
    onItemDblClick,
    onItemMouseIn,
    onItemMouseOut,
  } = props;
  const navRef = useRef<HTMLElement>(null);
  const [highlightedLinkId, setHighlightedLinkId] = useState<string | null>(
    null,
  );
  const subMenuOpenDirection = useMenuOpenDirection(navRef, menuItemHeight);

  const renderSubItems = (
    subMenuId: string,
    subItems: Array<VerticalMenuItem>,
  ) => {
    return (
      <ul
        className={classnames(
          style.subMenu,
          customCssClasses(semanticClassNames.subMenu),
          subMenuOpenDirection === 'top'
            ? style.menuDirectionTop
            : style.menuDirectionBottom,
          subMenuOpenSide === 'right'
            ? style.menuSideRight
            : style.menuSideLeft,
        )}
        data-testid={TestIds.subMenu(subMenuId)}
        id={TestIds.subMenu(subMenuId)}
      >
        {subItems.map((item, idx) => renderItem(item, `${subMenuId}-${idx}`))}
      </ul>
    );
  };

  const renderItem = (
    item: VerticalMenuItem,
    uniqueId: string,
  ): React.ReactNode => {
    const isEventDestinationTargetElementInsideMenu = (
      e:
        | React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>
        | React.FocusEvent<HTMLAnchorElement | HTMLSpanElement>,
    ) => {
      if (!navRef.current) {
        return false;
      }
      const destinationElement = e.relatedTarget as HTMLElement;
      return navRef.current.contains(destinationElement);
    };

    const onLinkBlur = (
      e: React.FocusEvent<HTMLAnchorElement | HTMLDivElement>,
    ) => {
      // We want to nullify the highlighted element if
      // the destination element of the blur event is not an element inside the menu
      if (!isEventDestinationTargetElementInsideMenu(e)) {
        setHighlightedLinkId(null);
      }
    };

    const handleOnItemMouseIn = onItemMouseIn
      ? (event: React.MouseEvent) => {
          onItemMouseIn?.(event, item);
        }
      : undefined;

    const handleOnItemMouseOut = onItemMouseOut
      ? (event: React.MouseEvent) => {
          onItemMouseOut?.(event, item);
        }
      : undefined;

    const handleOnItemClick = onItemClick
      ? (event: React.MouseEvent) => {
          onItemClick?.(event, item);
        }
      : undefined;

    const handleOnItemDblClick = onItemDblClick
      ? (event: React.MouseEvent) => {
          onItemDblClick?.(event, item);
        }
      : undefined;

    const subItemsExist = item.items && item.items.length > 0;
    return (
      <li
        className={classnames(
          style.item,
          customCssClasses(semanticClassNames.menuItem),
        )}
        key={uniqueId}
      >
        <div
          data-testid={TestIds.itemContentWrapper(uniqueId)}
          className={classnames(
            style.itemContentWrapper,
            item.selected && style.selected,
            !isValidLink(item.link) && style.noLink,
            shouldHighlightItem(highlightedLinkId, uniqueId) &&
              style.itemHighlight,
          )}
        >
          <span
            className={style.linkWrapper}
            onMouseEnter={() => setHighlightedLinkId(uniqueId)}
            onFocus={() => setHighlightedLinkId(uniqueId)}
            onMouseUp={safeBlur}
            onKeyUp={e => e.keyCode === 13 && safeBlur()}
            onMouseOut={e =>
              !isEventDestinationTargetElementInsideMenu(e) &&
              setHighlightedLinkId(null)
            }
            onBlur={onLinkBlur}
          >
            <Link
              dataTestId={TestIds.link(uniqueId)}
              className={style.label}
              {...item.link}
              aria-haspopup={subItemsExist ? 'true' : undefined}
              tabIndex={0}
              onClick={handleOnItemClick}
              onMouseEnter={handleOnItemMouseIn}
              onMouseLeave={handleOnItemMouseOut}
              onDoubleClick={handleOnItemDblClick}
            >
              {item.label}
              {item.displayCount && (
                <span className={style.displayCount}>
                  ({item.displayCount})
                </span>
              )}
            </Link>
          </span>
          {subItemsExist && renderSubItems(uniqueId, item.items!)}
        </div>
        {separatedButton && <div className={style.separator} />}
      </li>
    );
  };

  return (
    <nav
      id={id}
      {...getDataAttributes(props)}
      ref={navRef}
      aria-label={ariaLabel}
      className={classnames(
        style[skin],
        style.autoHeight,
        className,
        customCssClasses(semanticClassNames.root, ...customClassNames),
      )}
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className={style.menuContainer}>
        {items && items.map((item, idx) => renderItem(item, idx.toString()))}
      </ul>
    </nav>
  );
};

export default React.forwardRef(VerticalMenuCommonSkin);
