import {
    __awaiter,
    __generator
} from "tslib";
import {
    LocationService
} from '../../../services/ProductLocation/LocationService';
import {
    getSlugByProductId
} from './common/getSlugByProductId';
export var getProductUrl = function(_a) {
    var context = _a.context,
        origin = _a.origin,
        /*istanbul ignore next */
        _b = _a.isRelative,
        /*istanbul ignore next */
        isRelative = _b === void 0 ? false : _b;
    return function(_a) {
        var slug = _a.slug,
            id = _a.id;
        return __awaiter(void 0, void 0, void 0, function() {
            var locationService, productSlug, _b;
            return __generator(this, function(_c) {
                switch (_c.label) {
                    case 0:
                        if (!id && !slug) {
                            throw Error('slug or productId must be provided');
                        }
                        return [4 /*yield*/ , new LocationService({
                            siteStore: context.siteStore
                        }).init()];
                    case 1:
                        locationService = _c.sent();
                        if (!(slug !== null && slug !== void 0)) return [3 /*break*/ , 2];
                        _b = slug;
                        return [3 /*break*/ , 4];
                    case 2:
                        return [4 /*yield*/ , getSlugByProductId(id, {
                            context: context,
                            origin: origin
                        })];
                    case 3:
                        _b = (_c.sent());
                        _c.label = 4;
                    case 4:
                        productSlug = _b;
                        return [2 /*return*/ , isRelative ?
                            locationService.getRelativeProductUrl(productSlug) :
                            locationService.getAbsoluteProductUrl(productSlug)
                        ];
                }
            });
        });
    };
};
//# sourceMappingURL=getProductUrl.js.map