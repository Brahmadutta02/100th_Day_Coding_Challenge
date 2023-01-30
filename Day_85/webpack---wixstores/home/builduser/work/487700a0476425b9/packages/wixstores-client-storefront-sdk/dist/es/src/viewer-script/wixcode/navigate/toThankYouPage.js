import {
    ThankYouPageActions
} from '../../../actions/ThankYouPageActions/ThankYouPageActions';
export var toThankYouPage = function(_a) {
    var context = _a.context,
        origin = _a.origin;
    return function(args) {
        return new ThankYouPageActions({
            siteStore: context.siteStore,
            origin: origin
        }).navigateToThankYouPage(origin, args);
    };
};
//# sourceMappingURL=toThankYouPage.js.map