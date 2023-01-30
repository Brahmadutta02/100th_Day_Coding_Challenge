import { VerticalMenuItem } from '../../VerticalMenu.types';

const resolveInnerRoutes = (currentPagePath: string) => {
  const pathWithoutRoot = currentPagePath.replace('./', '');

  // Excluding the parent route to have only the inner routes
  return pathWithoutRoot.split('/').slice(1);
};

const getSelectedItems = (
  currentPagePath: string,
  items?: Array<VerticalMenuItem>,
): Array<VerticalMenuItem> => {
  let selectedItems: Array<VerticalMenuItem> = [];

  items?.forEach(item => {
    const isAnchorLink = !!item.link?.anchorDataId || !!item.link?.anchorCompId;
    const isCurrentDynamicLinkRoute = resolveInnerRoutes(currentPagePath).some(
      innerRoute => innerRoute && innerRoute === item.link?.innerRoute,
    );

    if (item.selected === false) {
      return;
    }

    // Only non anchor links can be considered as selected
    if (
      item.selected ||
      (item.link &&
        (item.link.href === currentPagePath || isCurrentDynamicLinkRoute) &&
        !isAnchorLink)
    ) {
      selectedItems.push(item);
    } else {
      const selectedSubItems = getSelectedItems(currentPagePath, item.items);
      if (selectedSubItems.length > 0) {
        selectedItems = [...selectedSubItems, ...selectedItems, item];
      }
    }
  });
  return selectedItems;
};

const regenerateItemsToIncludeSelectionProp = (
  items: Array<VerticalMenuItem>,
  selectedItems: Array<VerticalMenuItem>,
): Array<VerticalMenuItem> => {
  const newItems = items.map(item => {
    return {
      ...item,
      items: regenerateItemsToIncludeSelectionProp(
        item.items || [],
        selectedItems,
      ),
      selected: selectedItems.includes(item),
    };
  });

  return newItems;
};

const extendItemsWithSelectionProp = (
  currentPageHref: string,
  items: Array<VerticalMenuItem>,
) => {
  const selectedItems = getSelectedItems(currentPageHref, items);
  return regenerateItemsToIncludeSelectionProp(items, selectedItems);
};

export default extendItemsWithSelectionProp;
