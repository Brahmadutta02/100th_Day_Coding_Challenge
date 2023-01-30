var InstanceManager = /** @class */ (function() {
    function InstanceManager(instance) {
        this.instance = instance;
        //
    }
    InstanceManager.prototype.getInstance = function() {
        return this.instance;
    };
    InstanceManager.prototype.setInstance = function(instance) {
        this.instance = instance;
    };
    return InstanceManager;
}());
export {
    InstanceManager
};
//# sourceMappingURL=InstanceManager.js.map