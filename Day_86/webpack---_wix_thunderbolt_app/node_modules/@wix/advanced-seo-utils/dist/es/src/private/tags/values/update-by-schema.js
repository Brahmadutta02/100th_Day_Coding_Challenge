import {
    buildTagByValueAndSchema
} from '../utils/build-tag-by-value';
import {
    isEmpty
} from '../../utils/is-empty';
import {
    validateTagStructure
} from '../utils/validate-tag-structure';
export var updateValueBySchema = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.tags,
        tags = _c === void 0 ? [] : _c,
        tagSchema = _b.tagSchema,
        value = _b.value,
        meta = _b.meta,
        isDisabled = _b.isDisabled,
        _d = _b.allowEmptyForValidation,
        allowEmptyForValidation = _d === void 0 ? false : _d,
        isCustom = _b.isCustom;
    var tag = buildTagByValueAndSchema(value, tagSchema, {
        meta: meta,
        isDisabled: isDisabled,
        isCustom: isCustom,
    });
    if (isEmpty(tag) || !Array.isArray(tags)) {
        return tags;
    }
    var tagIndex = findTagIndexBySchema(tags, tagSchema);
    var updatedTags = removeTagBySchema(tags, tagSchema) || [];
    if ((value && value !== '') || allowEmptyForValidation || isDisabled) {
        if (tagIndex !== -1) {
            updatedTags.splice(tagIndex, 0, tag);
        } else {
            updatedTags.push(tag);
        }
    }
    return updatedTags;
};

function removeTagBySchema(tags, tagSchema) {
    var tagIndex = findTagIndexBySchema(tags, tagSchema);
    if (tagIndex !== -1) {
        var newTags = tags
            .slice(0, tagIndex)
            .concat(tags.slice(tagIndex + 1, tags.length));
        return removeTagBySchema(newTags, tagSchema);
    } else {
        return tags.slice();
    }
}

function findTagIndexBySchema(tags, tagSchema) {
    if (isEmpty(tagSchema) || isEmpty(tags)) {
        return -1;
    }
    var tagIndexDistanceFromEnd = tags
        .slice()
        .reverse()
        .findIndex(function(tag) {
            return validateTagStructure(tag, tagSchema);
        });
    return tagIndexDistanceFromEnd === -1 ?
        -1 :
        tags.length - 1 - tagIndexDistanceFromEnd;
}