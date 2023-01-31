import type {
  IMenuItem,
  ActiveAnchorData,
  IDropDownMenuItem,
} from '../DropDownMenu.types';
import { PAGE_ANCHORS } from '../constants';

const isAnchorLink = (item: IDropDownMenuItem) =>
  item.link && (item.link.anchorDataId || item.link.anchorCompId);

const removeQueryFromUrl = (url: string): string => url.split('?')[0];

const isActiveAnchorItem = (
  item: IDropDownMenuItem,
  href: string,
  activeAnchor: ActiveAnchorData,
) =>
  item.link &&
  (!item.link.href || removeQueryFromUrl(item.link.href) === href) &&
  ((item.link.anchorCompId && item.link.anchorCompId === activeAnchor.compId) ||
    (item.link.anchorDataId &&
      item.link.anchorDataId === activeAnchor.dataId &&
      item.link.anchorDataId !== PAGE_ANCHORS.TOP_ANCHOR_DATA_ID &&
      item.link.anchorDataId !== PAGE_ANCHORS.BOTTOM_ANCHOR_DATA_ID));

const findActivePopupItems = (
  items: Array<IDropDownMenuItem>,
  currentPopupId: string,
) =>
  items.filter(
    item =>
      item.link &&
      item.link.linkPopupId &&
      item.link.linkPopupId === currentPopupId,
  );

const isCurrentHrefItem = (
  item: IDropDownMenuItem,
  href: string,
  hasActiveAnchorSiblings: boolean,
) =>
  !hasActiveAnchorSiblings &&
  !isAnchorLink(item) &&
  item.link &&
  item.link.href &&
  removeQueryFromUrl(item.link.href) === href;

const findActiveAnchorItem = (
  items: Array<IDropDownMenuItem>,
  href: string,
  activeAnchorData: ActiveAnchorData,
) => {
  const activeAnchorExists = activeAnchorData.compId || activeAnchorData.dataId;
  let result: Set<IDropDownMenuItem> = new Set();
  if (activeAnchorExists) {
    result = new Set(
      items.filter(item => isActiveAnchorItem(item, href, activeAnchorData)),
    );
  }

  return result;
};

export const getSelectedItems = (
  items: Array<IMenuItem> = [],
  href = '',
  activeAnchorData: ActiveAnchorData = {},
  currentPopupId = '',
): Set<IDropDownMenuItem> => {
  const result = new Set([
    ...Array.from(findActiveAnchorItem(items, href, activeAnchorData)),
    ...Array.from(findActivePopupItems(items, currentPopupId)),
  ]);

  const hasActiveAnchorItems = result.size > 0;

  items.forEach(item => {
    const selectedSubItems =
      item.items && item.items.length
        ? getSelectedItems(item.items, href, activeAnchorData, currentPopupId)
        : new Set<IDropDownMenuItem>();

    // Used for Velo `.menuItems` API
    if (item.selected === false) {
      return;
    }

    if (
      // Used for Velo `.menuItems` API
      item.selected ||
      isCurrentHrefItem(item, href, hasActiveAnchorItems) ||
      (item.link &&
        Object.keys(item.link).length > 0 &&
        selectedSubItems.size > 0)
    ) {
      result.add(item);
    }

    selectedSubItems.forEach(subItem => result.add(subItem));
  });

  return result;
};

export function flattenMenuItemsWithParentId(items: Array<IDropDownMenuItem>) {
  return items.reduce(
    (acc: Array<IDropDownMenuItem>, item: IDropDownMenuItem) => {
      let menuChildren = [];
      if (item.items) {
        menuChildren = item.items.map((subItem: any) => {
          return { ...subItem, parent: item.id };
        });
      }
      return [...acc, ...[item], ...menuChildren];
    },
    [],
  );
}
