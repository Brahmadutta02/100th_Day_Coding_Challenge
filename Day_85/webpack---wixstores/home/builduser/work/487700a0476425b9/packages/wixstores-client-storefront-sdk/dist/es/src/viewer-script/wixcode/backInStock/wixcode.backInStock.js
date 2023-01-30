import {
    openBackInStockEmailModal
} from './openBackInStockEmailModal';
import {
    fetchBackInStockSettings
} from './fetchBackInStockSettings';
export function createBackInStockExports(_a) {
    var context = _a.context,
        origin = _a.origin;
    return {
        openBackInStockEmailModal: openBackInStockEmailModal({
            context: context,
            origin: origin
        }),
        fetchBackInStockSettings: fetchBackInStockSettings({
            context: context,
            origin: origin
        }),
    };
}
//# sourceMappingURL=wixcode.backInStock.js.map