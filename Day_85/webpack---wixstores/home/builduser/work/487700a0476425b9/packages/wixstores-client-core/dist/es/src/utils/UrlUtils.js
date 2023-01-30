import {
    __values
} from "tslib";
var URLUtils = /** @class */ (function() {
    function URLUtils() {}
    URLUtils.getParameterByName = function(name, url) {
        if (url === void 0) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    URLUtils.getHomepage = function(siteMap) {
        var e_1, _a;
        if (siteMap === void 0) {
            siteMap = [];
        }
        try {
            for (var siteMap_1 = __values(siteMap), siteMap_1_1 = siteMap_1.next(); !siteMap_1_1.done; siteMap_1_1 = siteMap_1.next()) {
                var page = siteMap_1_1.value;
                if (page.isHomePage) {
                    return page;
                }
                var homepage = URLUtils.getHomepage(page.subPages);
                if (homepage) {
                    return homepage;
                }
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally {
            try {
                if (siteMap_1_1 && !siteMap_1_1.done && (_a = siteMap_1.return)) _a.call(siteMap_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        return null;
    };
    URLUtils.getHomepageLink = function(siteMap) {
        var homepage = URLUtils.getHomepage(siteMap) || siteMap[0];
        return {
            sdkLink: homepage,
            url: URLUtils.getUrlFromPage(homepage),
        };
    };
    URLUtils.getUrlFromPage = function(page) {
        return page ? page.url : '#';
    };
    URLUtils.getUrlFromLink = function(sdkLink, siteMap) {
        var url;
        switch (sdkLink.type) {
            case 'PageLink':
            case 'AnchorLink':
                var page = siteMap.find(function(p) {
                    return p.pageId === sdkLink.pageId;
                });
                url = URLUtils.getUrlFromPage(page);
                break;
            case 'ExternalLink':
                return sdkLink.url;
            case 'EmailLink':
                url = sdkLink.recipient && "mailto:" + sdkLink.recipient;
                break;
            case 'PhoneLink':
                url = sdkLink.phoneNumber && "tel:" + sdkLink.phoneNumber;
                break;
            default:
        }
        return url || '#';
    };
    return URLUtils;
}());
export {
    URLUtils
};
//# sourceMappingURL=UrlUtils.js.map