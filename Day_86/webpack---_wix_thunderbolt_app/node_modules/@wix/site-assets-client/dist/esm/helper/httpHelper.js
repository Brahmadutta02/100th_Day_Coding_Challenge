export var CONTENT_TYPE_HEADER = 'content-type';
export var JSON_CONTENT_TYPE = 'application/json';
export var isAxiosStyleError = function(httpResponseError) {
    return !!(httpResponseError.response && httpResponseError.response.data && httpResponseError.response.status);
};