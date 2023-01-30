import { VerticalMenuItem } from '../../VerticalMenu.types';

const isItemVisible = (item: VerticalMenuItem): boolean =>
  typeof item.isVisible === 'undefined' || item.isVisible;

const filterVisibleItems = (
  items: Array<VerticalMenuItem>,
): Array<VerticalMenuItem> => {
  const visibleItems = items.filter((item: VerticalMenuItem) => {
    return isItemVisible(item);
  });
  return visibleItems.map((item: VerticalMenuItem): VerticalMenuItem => {
    if (typeof item.items === 'undefined' || !item.items.length) {
      return item;
    } else {
      return {
        ...item,
        items: filterVisibleItems(item.items),
      };
    }
  });
};

export default filterVisibleItems;
