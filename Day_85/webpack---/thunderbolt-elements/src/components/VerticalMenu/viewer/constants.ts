export const ARIA_LABEL_NAMESPACE = 'AriaLabels';
export const ARIA_LABEL_KEY = 'dropDownMenu_AriaLabel_TopLevel_SiteNavigation';
export const ARIA_LABEL_DEFAULT = 'Site';

export const LINK_ELEMENT_PREFIX = `linkElement-`;

export const TestIds = {
  link: (id: string) => `${LINK_ELEMENT_PREFIX}${id}`,
  subMenu: (id: string) => `subMenu-${id}`,
  subMenuPrefix: `subMenu-`,
  itemContentWrapper: (id: string) => `itemContentWrapper-${id}`,
} as const;
