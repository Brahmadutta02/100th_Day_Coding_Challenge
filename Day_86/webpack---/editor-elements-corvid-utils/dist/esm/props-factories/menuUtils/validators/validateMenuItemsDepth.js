import {
    reportError
} from '../../../reporters';
import {
    InvalidMenuDepthError
} from '../errors';
/**
 * Accepts array of menuItems
 * Checks if each item has menuItems property
 * Goes recursively through each item and checks if it has valid menuItems
 * Should report error if maxLevels is 0 and item has menuItems property
 */
export const validateMenuItemsDepth = (maxLevels) => (value) => {
    if (!value) {
        return true;
    }
    const checkMenuItemsLevel = ({
        currentLevel,
        items,
    }) => {
        if (!items) {
            return true;
        }
        /**
         * Should be the first check because we can have empty menu array
         */
        if (items.length === 0) {
            return true;
        } else if (currentLevel < 0) {
            return false;
        }
        return items.every(({
            menuItems,
            label,
            link
        }) => {
            const hasMenuItems = typeof menuItems !== 'undefined';
            if (!hasMenuItems) {
                return true;
            }
            const isValidMenuItems = checkMenuItemsLevel({
                items: menuItems,
                currentLevel: currentLevel - 1,
            });
            if (!isValidMenuItems) {
                throw new InvalidMenuDepthError(maxLevels + 1, label || link || '');
            }
            return isValidMenuItems;
        });
    };
    return value.every(({
        menuItems,
        label,
        link
    }) => {
        try {
            const result = checkMenuItemsLevel({
                items: menuItems,
                currentLevel: maxLevels - 1,
            });
            if (result === false) {
                throw new InvalidMenuDepthError(maxLevels + 1, label || link || '');
            }
        } catch (error) {
            reportError(error.message);
            return false;
        }
        return true;
    });
};
//# sourceMappingURL=validateMenuItemsDepth.js.map