var CartModalsUrlBuilder = /** @class */ (function() {
    function CartModalsUrlBuilder() {
        this.baseDomain = '';
    }
    CartModalsUrlBuilder.prototype.withBaseDomain = function(baseDomain) {
        this.baseDomain = baseDomain;
        return this;
    };
    CartModalsUrlBuilder.prototype.withModalName = function(modalName) {
        this.modalName = modalName;
        return this;
    };
    CartModalsUrlBuilder.prototype.withModalData = function(modalData) {
        this.modalData = modalData;
        return this;
    };
    CartModalsUrlBuilder.prototype.withInstance = function(instance) {
        this.instance = instance;
        return this;
    };
    CartModalsUrlBuilder.prototype.getQueryData = function() {
        var queryData = {};
        if (this.modalName) {
            queryData.modal = this.modalName;
        }
        if (this.modalData) {
            queryData.modalData = JSON.stringify(this.modalData);
        }
        return queryData;
    };
    CartModalsUrlBuilder.prototype.setSearchParams = function(url, queryData, numOfQueryParams) {
        Object.keys(queryData).forEach(function(key) {
            if (numOfQueryParams === 0) {
                url += "?";
                numOfQueryParams++;
            } else {
                url += "&";
            }
            url += key + "=" + queryData[key];
        });
        return url;
    };
    CartModalsUrlBuilder.prototype.build = function() {
        var numOfQueryParams = 0;
        var url = "https://" + this.baseDomain.replace('//', '') + "/storefront/cartModal";
        if (this.instance) {
            url += "?instance=" + this.instance;
            numOfQueryParams++;
        }
        return this.setSearchParams(url, this.getQueryData(), numOfQueryParams);
    };
    return CartModalsUrlBuilder;
}());
export {
    CartModalsUrlBuilder
};
export var aModalUrl = function() {
    return new CartModalsUrlBuilder();
};
//# sourceMappingURL=modalUrlBuilder.js.map