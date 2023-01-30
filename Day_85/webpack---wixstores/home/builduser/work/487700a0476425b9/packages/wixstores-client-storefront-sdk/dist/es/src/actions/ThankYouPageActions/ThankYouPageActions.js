import {
    __assign,
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    BaseActions
} from '../BaseActions';
import {
    PageMap
} from '@wix/wixstores-client-core';
var ThankYouPageActions = /** @class */ (function(_super) {
    __extends(ThankYouPageActions, _super);

    function ThankYouPageActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThankYouPageActions.prototype.thankYouPageInfoToQueryParams = function(thankYouPageInfo) {
        if (!(thankYouPageInfo.orderId || thankYouPageInfo.subscriptionId)) {
            throw Error('Cannot navigate without relevant Id');
        } else if (thankYouPageInfo.orderId && thankYouPageInfo.subscriptionId) {
            throw Error('Cannot navigate with both order Id and subscription Id');
        }
        return __assign({
            id: thankYouPageInfo.orderId ? thankYouPageInfo.orderId : thankYouPageInfo.subscriptionId,
            objectType: thankYouPageInfo.subscriptionId ? 'subscription' : ''
        }, (thankYouPageInfo.continueShoppingUrl ? {
            continueShoppingUrl: thankYouPageInfo.continueShoppingUrl
        } : {}));
    };
    ThankYouPageActions.prototype.navigateToThankYouPage = function(origin, thankYouPageInfo) {
        return __awaiter(this, void 0, void 0, function() {
            var thankYouPageQueryParams;
            return __generator(this, function(_a) {
                thankYouPageQueryParams = this.thankYouPageInfoToQueryParams(thankYouPageInfo);
                return [2 /*return*/ , this.siteStore.navigate({
                    sectionId: PageMap.THANKYOU,
                    state: thankYouPageQueryParams.id,
                    queryParams: __assign({
                        origin: origin,
                        objectType: thankYouPageQueryParams.objectType
                    }, (thankYouPageQueryParams.continueShoppingUrl ?
                        {
                            continueShoppingUrl: thankYouPageQueryParams.continueShoppingUrl
                        } :
                        {})),
                }, true)];
            });
        });
    };
    return ThankYouPageActions;
}(BaseActions));
export {
    ThankYouPageActions
};
//# sourceMappingURL=ThankYouPageActions.js.map