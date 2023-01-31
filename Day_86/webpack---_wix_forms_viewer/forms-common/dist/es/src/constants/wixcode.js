export var SUBMISSION_DISPLAY_FIELD = 'submissionTime';
export var PAYMENT_DISPLAY_FIELD = 'paymentTransactionId';
export var ITEM_ID_DISPLAY_FIELD = 'dynamicPageId';
export var TITLE_FIELD = 'title';
export var DISPLAY_NAME = 'displayName';
export var FieldCollectionType;
(function(FieldCollectionType) {
    FieldCollectionType["TEXT"] = "text";
    FieldCollectionType["IMAGE"] = "image";
    FieldCollectionType["BOOLEAN"] = "boolean";
    FieldCollectionType["NUMBER"] = "number";
    FieldCollectionType["DATETIME"] = "datetime";
    FieldCollectionType["TIME"] = "time";
    FieldCollectionType["RICHTEXT"] = "richtext";
    FieldCollectionType["COLOR"] = "color";
    FieldCollectionType["REFERENCE"] = "reference";
    FieldCollectionType["MULTI_REFERENCE"] = "multi-reference";
    FieldCollectionType["PAGELINK"] = "pagelink";
    FieldCollectionType["URL"] = "url";
    FieldCollectionType["DOCUMENT"] = "document";
    FieldCollectionType["VIDEO"] = "video";
    FieldCollectionType["ADDRESS"] = "address";
    FieldCollectionType["OBJECT"] = "object";
    FieldCollectionType["TAGS"] = "array<string>";
})(FieldCollectionType || (FieldCollectionType = {}));
export var ExecuteType;
(function(ExecuteType) {
    ExecuteType["CREATE"] = "CREATE";
    ExecuteType["UPDATE"] = "UPDATE";
    ExecuteType["REMOVE"] = "REMOVE";
    ExecuteType["RESTORE"] = "RESTORE";
})(ExecuteType || (ExecuteType = {}));
export var OperationType;
(function(OperationType) {
    OperationType["ADD"] = "add";
    OperationType["REMOVE"] = "remove";
})(OperationType || (OperationType = {}));
//# sourceMappingURL=wixcode.js.map