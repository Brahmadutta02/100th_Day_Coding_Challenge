import _ from 'lodash';
var CommandsExecutor = /** @class */ (function() {
    function CommandsExecutor(url, http) {
        this.url = url;
        this.http = http;
    }
    CommandsExecutor.prototype.execute = function(commandName, data, extraOptions) {
        if (extraOptions === void 0) {
            extraOptions = {};
        }
        var options = _.merge({
            templateParams: {
                commandName: commandName
            }
        }, extraOptions);
        return this.http.post(this.url, data, options);
    };
    return CommandsExecutor;
}());
export {
    CommandsExecutor
};
export default CommandsExecutor;
//# sourceMappingURL=commands-executor.js.map