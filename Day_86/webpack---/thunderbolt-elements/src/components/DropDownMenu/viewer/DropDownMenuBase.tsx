import * as React from 'react';
import classnames from 'classnames';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import type {
  IDropDownMenuBaseProps,
  IDropDownMenuImperativeActions,
} from '../DropDownMenu.types';
import { MORE_BUTTON_INDEX } from '../constants';
import { getQaDataAttributes } from '../../../core/commons/qaUtils';
import semanticClassNames from '../DropDownMenu.semanticClassNames';
import { DropDownMenuContent } from './DropDownMenuContent';

interface IDropDownMenuState {
  hover: string | null;
  hoverListPosition: number | string | null;
}

const initialState: IDropDownMenuState = {
  hover: null,
  hoverListPosition: null,
};

const getNumericItemIndex = (str: string, defaultValue: number) => {
  const parsedValue = parseInt(str, 10);
  if (Number.isNaN(parsedValue)) {
    return defaultValue;
  }
  return parsedValue;
};

const DropDownMenuBase: React.ForwardRefRenderFunction<
  IDropDownMenuImperativeActions,
  IDropDownMenuBaseProps
> = compProps => {
  const [compState, setCompState] =
    React.useState<IDropDownMenuState>(initialState);
  const rootRef = React.useRef<HTMLElement>();
  let timeoutId: ReturnType<typeof setTimeout>;

  const getCurrentTargetItem = (
    currentTarget: React.SyntheticEvent['currentTarget'],
  ) => {
    const { hover } = compState;
    const { id, items } = compProps;
    const childIndex = currentTarget.getAttribute('data-index') || '-1';
    const childIndexInt = parseInt(childIndex, 10);
    const isRootItemHovered =
      (currentTarget?.parentNode as Element)?.id !== `${id}moreContainer`;

    if (isRootItemHovered) {
      return items[childIndexInt];
    }

    if (!hover) {
      return null;
    }

    const hoverIndex = parseInt(hover, 10);

    return items[hoverIndex].items[childIndexInt];
  };

  const onItemMouseEnterHandler = (event: React.SyntheticEvent) => {
    const { onItemMouseIn } = compProps;
    const { currentTarget } = event;
    onItemMouseIn?.(event, getCurrentTargetItem(currentTarget));

    _itemMouseEnterHandler(event);
  };

  const _itemMouseEnterHandler = (event: React.SyntheticEvent) => {
    const { hover } = compState;
    const { id } = compProps;
    const { currentTarget } = event;

    const hoverListPosition = currentTarget.getAttribute('data-listposition');
    const childIndex = currentTarget.getAttribute('data-index') || '-1';
    const childIndexInt = parseInt(childIndex, 10);
    clearTimeout(timeoutId);

    const isRootItemHovered =
      (currentTarget?.parentNode as Element)?.id !== `${id}moreContainer`;

    if (
      isRootItemHovered &&
      ((Number.isInteger(childIndexInt) && childIndexInt !== -1) ||
        childIndex.startsWith('__')) &&
      childIndex !== hover
    ) {
      setCompState({ hover: childIndex, hoverListPosition });
    }
  };

  const onItemMouseLeaveHandler = (event: React.SyntheticEvent) => {
    const { onItemMouseOut } = compProps;
    const { currentTarget } = event;

    onItemMouseOut?.(event, getCurrentTargetItem(currentTarget));

    _itemMouseLeaveHandler();
  };

  const _itemMouseLeaveHandler = () => {
    timeoutId = setTimeout(() => {
      setCompState({ hover: null, hoverListPosition: null });
    }, 1000);
  };

  const _itemOnDoubleClick = (event: React.SyntheticEvent) => {
    const { onItemDblClick } = compProps;
    const { currentTarget } = event;

    onItemDblClick?.(event, getCurrentTargetItem(currentTarget));
  };

  const _itemOnClick = (event: React.SyntheticEvent) => {
    const { hover } = compState;
    const { currentTarget } = event;
    const { items, onItemClick, isTouchDevice } = compProps;

    onItemClick?.(event, getCurrentTargetItem(currentTarget));

    if (isTouchDevice) {
      const childIndex = currentTarget.getAttribute('data-index') || '-1';
      const isSubItemClicked =
        currentTarget.getAttribute('data-dropdown') === 'true';
      const childIndexInt = parseInt(childIndex, 10);
      const clickedItem = items ? items[childIndexInt] : null;
      const hasChildren =
        childIndex === MORE_BUTTON_INDEX || (clickedItem && clickedItem.items);

      if (isSubItemClicked) {
        _itemMouseLeaveHandler();
      } else {
        if (hover) {
          _itemMouseLeaveHandler();

          if (hasChildren && hover !== childIndex) {
            event.preventDefault();
            event.stopPropagation();
            _itemMouseEnterHandler(event);
          }
        } else if (hasChildren) {
          _itemMouseEnterHandler(event);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  };

  const _focusOnNextItem = (
    indexOfTabToFocus: number,
    isBackwards: boolean = false,
  ) => {
    if (rootRef.current) {
      const { id } = compProps;
      let child = (rootRef.current as any).querySelector(
        `#${id}itemsContainer > li:nth-child(${indexOfTabToFocus + 1})`,
      );

      while (child && child.getAttribute('aria-hidden') === 'true') {
        child = isBackwards ? child.previousSibling : child.nextSibling;
      }

      if (child) {
        const focusElement = child.childNodes?.[0];
        if (focusElement) {
          focusElement.focus();
          return true;
        }
      }
    }
    return false;
  };

  const _shiftFocusToSubMenu = (indexToFocus: number) => {
    const { id } = compProps;

    if (rootRef.current) {
      const subMenuItem = (rootRef.current as any).querySelector(
        `#${id}moreContainer li:nth-child(${indexToFocus + 1}) a`,
      );

      if (subMenuItem) {
        subMenuItem.focus();
        return true;
      }
    }
    return false;
  };

  const _onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const { hover } = compState;
    const { items } = compProps;
    const { key, shiftKey } = event;

    if (key === 'Tab' && hover !== null) {
      const currentFocusedMenuIndex = hover ? parseInt(hover, 10) : -1;
      let shouldPreventDefault = false;

      if (!shiftKey && items) {
        const hoverItem = items[currentFocusedMenuIndex];

        if (hoverItem && hoverItem.items) {
          shouldPreventDefault = _shiftFocusToSubMenu(0);
        }
      }

      if (shouldPreventDefault) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  const _subMenuKeyDownHandler = (event: React.KeyboardEvent) => {
    const { hover } = compState;
    const { items } = compProps;
    const { shiftKey, key, target, currentTarget } = event;
    let listElement = target as HTMLLIElement | null;

    if (
      target !== currentTarget &&
      (target as Element).tagName.toLowerCase() !== 'li'
    ) {
      listElement = (target as Element).closest('li');
    }

    if (listElement) {
      const focusedIndex = listElement.getAttribute('data-index') || '';
      let shouldPreventDefault = false;

      if (hover && key === 'Tab') {
        const menuItemIndex = getNumericItemIndex(hover, -1);
        const focusedSubMenuIndex = parseInt(focusedIndex, 10);

        if (menuItemIndex >= 0) {
          if (shiftKey) {
            if (focusedSubMenuIndex === 0) {
              shouldPreventDefault = _focusOnNextItem(menuItemIndex, shiftKey);
            }
          } else if (items && items[menuItemIndex]) {
            const item = items[menuItemIndex];
            if (
              item &&
              item.items &&
              item.items.length === focusedSubMenuIndex + 1
            ) {
              shouldPreventDefault = _focusOnNextItem(menuItemIndex + 1);
            }
          }
        }
      }

      if (shouldPreventDefault) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  function _getWrapperDataAttrs(
    props: IDropDownMenuBaseProps,
    state: IDropDownMenuState,
  ) {
    const { hover, hoverListPosition } = state;
    const {
      stretchButtonsToMenuWidth,
      sameWidthButtons,
      skinExports,
      alignButtons = 'center',
      items,
      isQaMode,
      fullNameCompType,
    } = props;

    return {
      'data-stretch-buttons-to-menu-width': stretchButtonsToMenuWidth,
      'data-same-width-buttons': sameWidthButtons,
      'data-num-items': items?.length,
      'data-menuborder-y': skinExports.menuBorderY,
      'data-menubtn-border': skinExports.menuBtnBorder,
      'data-ribbon-els': skinExports.ribbonEls,
      'data-label-pad': skinExports.labelPad,
      'data-ribbon-extra': skinExports.ribbonExtra,
      'data-drophposition': hoverListPosition,
      'data-dropalign': alignButtons,
      'data-hovered-item': hover,
      ...getQaDataAttributes(isQaMode, fullNameCompType),
    };
  }

  function render(props: IDropDownMenuBaseProps, state: IDropDownMenuState) {
    const { id, className, customClassNames = [], skin, rtl, styles } = props;
    const wrapperProps = {
      id,
      class: classnames(
        styles[skin],
        styles.wrapper,
        className,
        customCssClasses(semanticClassNames.root, ...customClassNames),
        'hidden-during-prewarmup', // TODO: should 'hidden-during-prewarmup' be removed?
      ),
      ref: rootRef,
      tabIndex: -1,
      dir: rtl ? 'rtl' : 'ltr',
      ..._getWrapperDataAttrs(props, state),
    };

    return (
      <wix-dropdown-menu {...wrapperProps}>
        <DropDownMenuContent
          {...props}
          {...state}
          onItemMouseEnter={
            compProps.isTouchDevice ? undefined : onItemMouseEnterHandler
          }
          onItemMouseLeave={
            compProps.isTouchDevice ? undefined : onItemMouseLeaveHandler
          }
          onItemDoubleClick={
            compProps.onItemDblClick ? _itemOnDoubleClick : undefined
          }
          onItemClick={
            compProps.isTouchDevice || compProps.onItemClick
              ? _itemOnClick
              : undefined
          }
          onMenuKeyDown={_onMenuKeyDown}
          onSubMenuKeyDown={_subMenuKeyDownHandler}
        />
      </wix-dropdown-menu>
    );
  }

  return render(compProps, compState);
};

export default React.forwardRef(DropDownMenuBase);
