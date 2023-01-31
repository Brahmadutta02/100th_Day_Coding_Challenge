var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    TAG_SCHEMAS
} from '../../types/TagSchemas';
import {
    isEmpty
} from '../../utils/is-empty';
export function buildTagByValueAndIdentifier(value, identifier, _a) {
    var enableValidation = _a.enableValidation,
        tagLabel = _a.tagLabel;
    var tagSchema = tagLabel ?
        TAG_SCHEMAS[identifier](tagLabel) :
        TAG_SCHEMAS[identifier];
    return buildTagByValueAndSchema(value, tagSchema, {
        enableValidation: enableValidation
    });
}
export function buildTagByValueAndSchema(value, tagSchema, _a) {
    var enableValidation = _a.enableValidation,
        meta = _a.meta,
        isDisabled = _a.isDisabled,
        isCustom = _a.isCustom;
    if (isEmpty(tagSchema)) {
        return {};
    }
    var tag = {
        type: tagSchema.type,
    };
    if (tagSchema.props) {
        tag.props = __assign({}, tagSchema.props);
    }
    if (meta) {
        tag.meta = meta;
    }
    if (isDisabled !== undefined) {
        tag.disabled = isDisabled;
    }
    if (isCustom !== undefined) {
        tag.custom = isCustom;
    }
    var isValid = tagSchema.setValue(tag, value, enableValidation).isValid;
    return isValid ? tag : {};
}