"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var cookie_storage_1 = require("./storage/cookie-storage");
var config_storage_1 = require("./storage/config-storage");
var utils_1 = require("./lib/utils");
var SlaveBsiManager = /** @class */ (function() {
    function SlaveBsiManager() {
        this.acitivityListeners = [];
        this.initialized = false;
    }
    SlaveBsiManager.create = function(api, options) {
        return new SlaveBsiManager().init(api, options);
    };
    SlaveBsiManager.prototype.extend = function() {
        var _this = this;
        if (!this.options.enableCookie) {
            return;
        }
        var ttl = this.cookie.set(this.config.get()).ttl;
        clearTimeout(this.timeout);
        if (ttl) {
            // Keep the cookie alive until a new bsi value is set on the common config in master
            this.timeout = setTimeout(function() {
                return _this.extend();
            }, ttl - 1000);
        }
    };
    SlaveBsiManager.prototype.getAndNotify = function() {
        // Notify listeners
        this.acitivityListeners.forEach(function(listener) {
            return listener();
        });
        return this.get();
    };
    SlaveBsiManager.prototype.get = function() {
        return this.options.enableCookie ?
            this.config.get() || this.cookie.get() :
            this.config.get();
    };
    SlaveBsiManager.prototype.init = function(api, options) {
        var _this = this;
        utils_1.validateExternalApi(api, 'getCommonConfig');
        this.api = api;
        this.options = options;
        this.config = new config_storage_1.ConfigStorage(this.api.getConsentPolicy, this.api.getCommonConfig).subscribe(function() {
            return _this.extend();
        });
        this.cookie = new cookie_storage_1.CookieStorage(this.config, this.api.getCookieReaderWriter);
        this.initialized = true;
        this.extend();
        return this;
    };
    SlaveBsiManager.prototype.destroy = function() {
        clearTimeout(this.timeout);
    };
    SlaveBsiManager.prototype.onActivity = function(listener) {
        if (typeof listener !== 'function') {
            throw new Error("bsiManager: listener must be a function");
        }
        this.acitivityListeners.push(listener);
        return this;
    };
    SlaveBsiManager.prototype.getBsi = function(_a) {
        var extend = (_a === void 0 ? {
            extend: true
        } : _a).extend;
        if (!this.initialized) {
            throw new Error('bsiManager: please call init() first');
        }
        if (extend) {
            return this.getAndNotify();
        }
        return this.get();
    };
    return SlaveBsiManager;
}());
exports.SlaveBsiManager = SlaveBsiManager;
//# sourceMappingURL=manager-slave.js.map