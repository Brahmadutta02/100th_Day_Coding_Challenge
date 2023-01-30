export var filterIdentifierKeys = function(identifiers, ignoreList) {
    return Object.keys(identifiers).filter(function(identifierKey) {
        return !ignoreList.includes(identifierKey);
    });
};