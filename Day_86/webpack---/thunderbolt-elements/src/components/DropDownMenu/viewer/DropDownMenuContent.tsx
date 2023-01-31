import * as React from 'react';
import classnames from 'classnames';
import type {
  MenuItemProps,
  TranslationGetter,
} from '@wix/editor-elements-types/thunderbolt';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import {
  IDropDownMenuItem,
  IDropDownMenuBaseProps,
} from '../DropDownMenu.types';
import {
  IMenuButtonProps,
  MenuButtonProps,
} from '../../MenuButton/MenuButton.types';
import {
  A11Y_SUBMENU_INDICATION_DEFAULT,
  A11Y_SUBMENU_INDICATION_KEY,
  A11Y_SUBMENU_INDICATION_NAMESPACE,
  ARIA_LABEL_DEFAULT,
  ARIA_LABEL_KEY,
  ARIA_LABEL_NAMESPACE,
  DATA_ATTRS,
  MORE_BUTTON_INDEX,
  SKINS_WITH_UTILITY_SET,
} from '../constants';
import semanticClassNames from '../DropDownMenu.semanticClassNames';
import { flattenMenuItemsWithParentId, getSelectedItems } from './utils';

type IDropDownMenuContentProps = IDropDownMenuBaseProps & {
  hover: string | null;
  hoverListPosition: number | string | null;
  onItemClick: any;
  onItemMouseEnter: any;
  onItemMouseLeave: any;
  onMenuKeyDown: any;
  onSubMenuKeyDown: any;
};

export const DropDownMenuContent: React.FC<
  IDropDownMenuContentProps
> = compProps => {
  const selectedItems = React.useMemo(
    () =>
      getSelectedItems(
        compProps.items,
        compProps.currentUrl,
        compProps.activeAnchor,
        compProps.currentPopupId,
      ),
    [
      compProps.items,
      compProps.currentUrl,
      compProps.activeAnchor,
      compProps.currentPopupId,
    ],
  );

  const _getMenuButtonElement = (
    props: IDropDownMenuContentProps,
    itemProps: Omit<
      MenuButtonProps,
      'mouseEnterHandler' | 'mouseLeaveHandler' | 'onMouseClick'
    >,
  ) => {
    const { Button } = props;
    const defaultProps: Pick<
      MenuButtonProps,
      | 'onMouseEnter'
      | 'onMouseLeave'
      | 'onClick'
      | 'onDoubleClick'
      | 'textAlign'
    > = {
      onMouseEnter: props.onItemMouseEnter,
      onMouseLeave: props.onItemMouseLeave,
      onDoubleClick: props.onItemDblClick,
      onClick: props.onItemClick,
      textAlign: props.alignText,
    };
    const menuButtonProps: MenuButtonProps = {
      ...defaultProps,
      ...itemProps,
    };

    return <Button {...menuButtonProps} />;
  };

  function _getButtonPositionInList(
    index: number,
    length: number,
    dropdown?: boolean,
    rtl?: boolean,
    buttonAlign?: string,
    stretch?: boolean,
  ) {
    if (index === length - 1) {
      if (length === 1) {
        return 'dropLonely';
      }
      if (dropdown) {
        return 'bottom';
      }
      if (!stretch && buttonAlign !== 'right') {
        return 'center';
      }
      return rtl ? 'left' : 'right';
    }
    if (index === 0) {
      if (dropdown) {
        return 'top';
      }
      if (!stretch && buttonAlign !== 'left') {
        return 'center';
      }
      return rtl ? 'right' : 'left';
    }
    return dropdown ? 'dropCenter' : 'center';
  }

  const generateItemKey = (
    label: string,
    keyCache: { [key: string]: number },
  ): string => {
    const maxTries = 100;
    let key = label;
    let count = 0;

    while (keyCache[key] && count < maxTries) {
      key += keyCache[key]++;
      count++;
    }

    keyCache[key] = (keyCache[key] || 0) + 1;

    return key;
  };

  const _getItemElements = (
    props: IDropDownMenuContentProps,
    {
      items = [],
      className,
      dropdown,
      rtl,
      buttonAlign,
      stretch,
    }: {
      items?: Array<IDropDownMenuItem>;
      className: string;
      dropdown?: boolean;
      rtl?: boolean;
      buttonAlign?: string;
      stretch?: boolean;
    },
  ) => {
    const keyCache: { [key: string]: number } = {};
    return items.map((item: IDropDownMenuItem, index) => {
      const ref = `${dropdown ? 'moreContainer' : ''}${index}`;
      const itemProps: IMenuButtonProps & { key: string } = {
        isContainer: dropdown,
        isSelected: selectedItems.has(item),
        positionInList:
          item.positionInList ||
          _getButtonPositionInList(
            index,
            items.length,
            dropdown,
            rtl,
            buttonAlign,
            stretch,
          ),
        id: _getChildId(ref),
        index,
        refInParent: ref,
        isDropDownButton: dropdown,
        'aria-haspopup':
          item.hasPopup || (item?.items?.length ?? 0) > 0 ? 'true' : 'false',
        'aria-describedby': item?.items?.length
          ? _getHiddenA11ySubMenuIndicationId()
          : undefined,
        tagName: 'li',
        direction: rtl ? 'rtl' : 'ltr',
        parentId: item.parent,
        dataId: item.id,
        label: item.label,
        link: item.link,
        className,
        key: generateItemKey(item.label, keyCache),
        subItems: !dropdown ? item.items : undefined,
      };

      return _getMenuButtonElement(props, itemProps);
    });
  };

  function _getMoreButton(props: IDropDownMenuContentProps) {
    const {
      rtl,
      styles,
      stretchButtonsToMenuWidth,
      alignButtons = 'center',
      moreButtonLabel,
      onItemMouseEnter,
      onItemMouseLeave,
      onSubMenuKeyDown,
    } = props;
    const itemId = MORE_BUTTON_INDEX;
    let positionInList = rtl ? 'left' : 'right';
    if (!stretchButtonsToMenuWidth && alignButtons !== 'right') {
      positionInList = 'center';
    }
    const moreButtonProps: IMenuButtonProps & { key: string } = {
      label: moreButtonLabel || '',
      isSelected: false,
      positionInList,
      id: _getChildId(itemId),
      index: MORE_BUTTON_INDEX,
      refInParent: itemId,
      key: itemId,
      onFocus: onItemMouseEnter,
      onBlur: onItemMouseLeave,
      'aria-haspopup': 'true',
      tagName: 'li',
      onKeyDown: onSubMenuKeyDown,
      isDropDownButton: false,
      className: styles.moreButton,
      isMoreButton: true,
    };

    return _getMenuButtonElement(props, moreButtonProps);
  }

  function _getMenuItems(props: IDropDownMenuContentProps) {
    const {
      styles,
      items,
      rtl,
      stretchButtonsToMenuWidth,
      alignButtons = 'center',
    } = props;
    const elements = _getItemElements(props, {
      items,
      className: classnames(
        styles.menuItem,
        customCssClasses(semanticClassNames.menuItem),
      ),
      rtl,
      buttonAlign: alignButtons,
      stretch: stretchButtonsToMenuWidth,
    });
    const moreButton = _getMoreButton(props);

    if (moreButton) {
      elements.push(moreButton);
    }

    return elements;
  }

  function _getMenuItemsContent(props: IDropDownMenuContentProps) {
    const {
      styles,
      skin,
      alignButtons = 'center',
      marginAllChildren,
      onMenuKeyDown,
    } = props;
    const menuItems = _getMenuItems(props);
    const itemsContainerId = _getChildId('itemsContainer');

    let content = (
      <ul
        className={classnames(styles.itemsContainer, styles[`${alignButtons}`])}
        id={itemsContainerId}
        style={{ textAlign: alignButtons }}
        data-marginallchildren={marginAllChildren}
        onKeyDown={onMenuKeyDown}
      >
        {menuItems}
      </ul>
    );

    const hasWrapper = (() => {
      switch (skin) {
        case 'IndentedMenuButtonSkin':
        case 'ShinyMenuIIButtonSkin':
        case 'SloppyBorderMenuButtonSkin':
          return true;
        default:
          return false;
      }
    })();

    if (hasWrapper) {
      const wrapperId = _getChildId('wrapper');
      content = (
        <div
          className={classnames(styles.itemsContainerWrapper)}
          id={wrapperId}
        >
          {content}
        </div>
      );
    }

    return content;
  }

  function _getUtilityItem(props: IDropDownMenuBaseProps) {
    const { skin, styles } = props;
    let utilityItem = null;

    if (SKINS_WITH_UTILITY_SET.has(skin)) {
      utilityItem = <div className={styles.utility} />;
    }

    return utilityItem;
  }

  function _getDropPosition(props: IDropDownMenuContentProps) {
    const { hover, hoverListPosition } = props;
    return hover ? hoverListPosition : null;
  }

  function _getDropDownChildren(props: IDropDownMenuContentProps) {
    const {
      items,
      rtl,
      alignButtons = 'center',
      stretchButtonsToMenuWidth,
      hover,
      styles,
    } = props;
    let dropDownItems = null;
    let dropDownChildren: Array<React.ReactNode> = [];

    if (items && hover) {
      const hoverNum = parseInt(hover, 10);
      if (Number.isInteger(hoverNum) && items[hoverNum]) {
        dropDownItems = items[hoverNum].items;
      } else if (hover === MORE_BUTTON_INDEX) {
        const validItems: Array<MenuItemProps> = items.filter(
          (item: MenuItemProps, index: number) => {
            const id = _getChildId(index.toString());
            const foundMenuItemElement = document.getElementById(id);
            return foundMenuItemElement?.style?.visibility === 'hidden';
          },
        );
        dropDownItems = flattenMenuItemsWithParentId(validItems);
      }
    }

    if (dropDownItems) {
      dropDownChildren = _getItemElements(props, {
        items: dropDownItems,
        className: styles.dropdownButton,
        dropdown: true,
        rtl,
        buttonAlign: alignButtons,
        stretch: stretchButtonsToMenuWidth,
      });
    }

    return dropDownChildren;
  }

  function _getDropDownContent(props: IDropDownMenuContentProps) {
    const { alignButtons = 'center', onSubMenuKeyDown, hover, styles } = props;
    const dropDownChildren = _getDropDownChildren(props);
    const moreContainerId = _getChildId('moreContainer');
    const dropWrapperId = _getChildId('dropWrapper');
    const showDropDown = (dropDownChildren?.length ?? 0) > 0;
    const className = classnames(styles.dropWrapper, {
      [styles.showMore]: showDropDown,
    });
    const dataDropDownShown = showDropDown;
    const dropPosition = _getDropPosition(props);

    return (
      <div
        className={className}
        id={dropWrapperId}
        data-drophposition={dropPosition}
        data-dropalign={alignButtons}
        {...{ [DATA_ATTRS.dropdownShown]: dataDropDownShown }}
      >
        <ul
          className={classnames(
            styles.moreContainer,
            customCssClasses(semanticClassNames.subMenu),
          )}
          data-hover={hover}
          id={moreContainerId}
          onKeyDown={onSubMenuKeyDown}
        >
          {dropDownChildren}
        </ul>
      </div>
    );
  }

  const _getChildId = (name: string) => {
    return `${compProps.id}${name}`;
  };

  const _getHiddenA11ySubMenuIndicationId = () => {
    return `${_getChildId('navContainer')}-hiddenA11ySubMenuIndication`;
  };

  const _getHiddenA11ySubMenuIndication = (translate: TranslationGetter) => {
    return (
      <div style={{ display: 'none' }} id={_getHiddenA11ySubMenuIndicationId()}>
        {translate(
          A11Y_SUBMENU_INDICATION_NAMESPACE,
          A11Y_SUBMENU_INDICATION_KEY,
          A11Y_SUBMENU_INDICATION_DEFAULT,
        )}
      </div>
    );
  };

  function render(props: IDropDownMenuContentProps) {
    const { translate, styles } = props;
    const menuItemsContent = _getMenuItemsContent(props);
    const utilityItem = _getUtilityItem(props);
    const dropDownContent = _getDropDownContent(props);
    const ariaLabel = translate(
      ARIA_LABEL_NAMESPACE,
      ARIA_LABEL_KEY,
      ARIA_LABEL_DEFAULT,
    );

    const navContainerId = _getChildId('navContainer');

    return (
      <nav
        className={classnames(styles.navContainer)}
        id={navContainerId}
        aria-label={ariaLabel}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {utilityItem}
        {menuItemsContent}
        {dropDownContent}
        {_getHiddenA11ySubMenuIndication(translate)}
      </nav>
    );
  }

  return render(compProps);
};
