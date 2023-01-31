import { DropDownMenuSkin } from './DropDownMenu.types';

export const ARIA_LABEL_NAMESPACE = 'ariaLabels';
export const ARIA_LABEL_KEY = 'dropDownMenu_AriaLabel_TopLevel_SiteNavigation';
export const ARIA_LABEL_DEFAULT = 'Site';
export const A11Y_SUBMENU_INDICATION_NAMESPACE = 'a11ySubmenuIndications';
export const A11Y_SUBMENU_INDICATION_KEY = 'dropDownMenu_a11ySubmenuIndication';
export const A11Y_SUBMENU_INDICATION_DEFAULT =
  'Use tab to navigate through the menu items.';

export const SKINS_WITH_UTILITY_SET = new Set<DropDownMenuSkin>([
  'PointerMenuButtonHorizontalMenuAdaptationSkin',
  'PointerMenuButtonSkin',
  'VerticalRibbonsMenuButtonSkin',
  'RibbonsMenuButtonSkin',
]);

export const DATA_ATTRS = {
  dropdownShown: 'data-dropdown-shown',
};

export const MORE_BUTTON_INDEX = '__more__';

export const PAGE_ANCHORS = {
  TOP_ANCHOR_DATA_ID: 'SCROLL_TO_TOP',
  BOTTOM_ANCHOR_DATA_ID: 'SCROLL_TO_BOTTOM',
};
