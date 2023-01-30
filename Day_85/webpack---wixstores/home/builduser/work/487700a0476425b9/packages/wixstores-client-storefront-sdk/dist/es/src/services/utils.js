export function queryToString(queryStringObj) {
    return Object.keys(queryStringObj)
        .map(function(prop) {
            return prop + "=" + encodeURIComponent(queryStringObj[prop]).replace(/%20/g, '+').replace(/\*/g, '%2A');
        })
        .join('&');
}
/* istanbul ignore next: todo(sagi): test */
export function capitalizeFirstLetters(string) {
    if (string === void 0) {
        string = '';
    }
    return string
        .split(' ')
        .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
        })
        .join(' ');
}
//# sourceMappingURL=utils.js.map