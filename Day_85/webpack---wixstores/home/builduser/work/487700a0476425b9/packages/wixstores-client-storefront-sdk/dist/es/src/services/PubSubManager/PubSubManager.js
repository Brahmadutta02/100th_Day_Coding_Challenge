var PubSubManager = /** @class */ (function() {
    function PubSubManager(pubSub) {
        this.pubSub = pubSub;
        this.subscribers = {};
        //
    }
    PubSubManager.prototype.subscribe = function(event, fn, persistent) {
        if (persistent === void 0) {
            persistent = false;
        }
        var id = this.pubSub.subscribe(event, fn, persistent);
        /* istanbul ignore else if */
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(id);
        return id;
    };
    PubSubManager.prototype.publish = function(event, data, persistent) {
        if (persistent === void 0) {
            persistent = false;
        }
        this.pubSub.publish(event, data, persistent);
    };
    /* istanbul ignore next: todo: test */
    PubSubManager.prototype.unsubscribe = function(event, id) {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(function(s) {
                return s !== id;
            });
            this.pubSub.unsubscribe(event, id);
        }
    };
    /* istanbul ignore next: todo: test */
    PubSubManager.prototype.unsubscribeAll = function() {
        var _this = this;
        Object.keys(this.subscribers).forEach(function(event) {
            _this.subscribers[event].forEach(function(s) {
                _this.pubSub.unsubscribe(event, s);
            });
        });
    };
    return PubSubManager;
}());
export {
    PubSubManager
};
//# sourceMappingURL=PubSubManager.js.map