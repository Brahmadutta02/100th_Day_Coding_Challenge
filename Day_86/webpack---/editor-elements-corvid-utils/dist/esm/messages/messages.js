import {
    assert
} from '../assert';
import {
    templates
} from './messageTemplates';
export const nilAssignmentMessage = ({
    compName,
    functionName,
    propertyName,
    index
}) => {
    if (assert.isNumber(index)) {
        return templates.warning_not_null_with_index({
            propertyName,
            functionName,
            index,
        });
    }
    if (compName) {
        return templates.warning_not_null_for_comp_name({
            compName,
            functionName,
            propertyName,
        });
    }
    return templates.warning_not_null({
        functionName,
        propertyName
    });
};
export const missingFieldMessage = ({
    functionName,
    propertyName,
    index,
}) => {
    return assert.isNumber(index) ?
        templates.error_mandatory_val_with_index({
            functionName,
            propertyName,
            index,
        }) :
        templates.error_mandatory_val({
            functionName,
            propertyName
        });
};
export const invalidStringLengthMessage = ({
    functionName,
    propertyName,
    value,
    maximum,
    minimum,
    index
}) => {
    if (minimum && maximum) {
        if (minimum === maximum) {
            return assert.isNumber(index) ?
                templates.error_length_accept_single_value_with_index({
                    functionName,
                    propertyName,
                    value,
                    expectedValue: minimum,
                    index,
                }) :
                templates.error_length_accept_single_value({
                    functionName,
                    propertyName,
                    value,
                    expectedValue: minimum,
                });
        }
        return assert.isNumber(index) ?
            templates.error_length_in_range_with_index({
                functionName,
                propertyName,
                value,
                maximum,
                minimum,
                index,
            }) :
            templates.error_length_in_range({
                functionName,
                propertyName,
                value,
                maximum,
                minimum,
            });
    }
    if (!minimum && maximum) {
        return assert.isNumber(index) ?
            templates.error_length_exceeds_with_index({
                functionName,
                propertyName,
                value,
                maximum,
                index,
            }) :
            templates.error_length_exceeds({
                functionName,
                propertyName,
                value,
                maximum,
            });
    }
    // valided minimum length
    return assert.isNumber(index) ?
        templates.error_length_less_than_with_index({
            functionName,
            propertyName,
            value,
            minimum: minimum,
            index,
        }) :
        templates.error_length_less_than({
            functionName,
            propertyName,
            value,
            minimum: minimum,
        });
};
export const invalidNumberBoundsMessage = ({
    functionName,
    propertyName,
    value,
    minimum,
    maximum,
    index
}) => {
    if (minimum && maximum) {
        if (minimum === maximum) {
            return assert.isNumber(index) ?
                templates.error_accept_single_value_with_index({
                    functionName,
                    propertyName,
                    expectedValue: minimum,
                    value,
                    index,
                }) :
                templates.error_accept_single_value({
                    functionName,
                    propertyName,
                    expectedValue: minimum,
                    value,
                });
        }
        return assert.isNumber(index) ?
            templates.error_range_with_index({
                functionName,
                propertyName,
                value,
                maximum,
                minimum,
                index,
            }) :
            templates.error_range({
                functionName,
                propertyName,
                value,
                maximum,
                minimum,
            });
    }
    if (!minimum && maximum) {
        return assert.isNumber(index) ?
            templates.error_less_than_with_index({
                functionName,
                propertyName,
                maximum,
                value,
                index,
            }) :
            templates.error_less_than({
                functionName,
                propertyName,
                maximum,
                value,
            });
    }
    return assert.isNumber(index) ?
        templates.error_larger_than_with_index({
            functionName,
            propertyName,
            value,
            minimum: minimum,
            index,
        }) :
        templates.error_larger_than({
            functionName,
            propertyName,
            value,
            // TS should know that minimum can't be undefined here
            minimum: minimum,
        });
};
export const invalidTypeMessage = ({
    functionName,
    propertyName,
    types,
    value,
    index
}) => {
    const expectedType = types
        .map(type => (type === 'nil' ? 'null' : type))
        .join(',');
    return assert.isNumber(index) ?
        templates.error_type_with_index({
            functionName,
            index,
            propertyName,
            value,
            expectedType,
        }) :
        templates.error_type({
            functionName,
            propertyName,
            value,
            expectedType,
        });
};
export const invalidEnumValueMessage = ({
    functionName,
    propertyName,
    value,
    enum: enumArray,
    index
}) => {
    const expectedType = `from (${enumArray.join(',')})`;
    return assert.isNumber(index) ?
        templates.error_type_with_index({
            functionName,
            propertyName,
            value,
            expectedType,
            index,
        }) :
        templates.error_type({
            functionName,
            propertyName,
            value,
            expectedType,
        });
};
export const patternMismatchMessage = ({
    functionName,
    propertyName,
    value,
    index,
}) => {
    return assert.isNumber(index) ?
        templates.error_bad_format_with_index({
            functionName,
            propertyName,
            value,
            index,
        }) :
        templates.error_bad_format({
            functionName,
            propertyName,
            value
        });
};
export const noneImageInGallery = galleryId => {
    return templates.warning_non_images_in_gallery({
        galleryId,
    });
};
export const invalidSlideInputMessage = ({
    functionName,
    propertyName,
    slideShowId,
    value,
    minimum,
    maximum
}) => templates.error_slide_input({
    functionName,
    propertyName,
    slideShowId,
    value,
    maximum,
    minimum,
});
export const invalidStateInputMessage = ({
    functionName,
    propertyName,
    stateBoxId,
    value
}) => templates.error_state_input({
    functionName,
    propertyName,
    stateBoxId,
    value,
});
export const invalidImageInGalleryWithIndex = ({
    wrongValue,
    propertyName,
    index
}) => {
    return templates.error_bad_image_format_with_index({
        propertyName,
        index,
        wrongValue,
    });
};
export const invalidFileTypeForFileLimit = ({
    propertyName
}) => {
    return templates.error_invalid_type_for_file_limit({
        propertyName,
    });
};
export const unsupportedLinkType = ({
    functionName,
    wrongValue,
    index
}) => {
    return templates.error_supported_link_type_with_index({
        functionName,
        wrongValue,
        index,
    });
};
export const invalidTargetWithIndex = ({
    functionName,
    wrongValue,
    index
}) => {
    return templates.error_invalid_target_with_index({
        functionName,
        wrongValue,
        index,
    });
};
export const unsupportedFunctionForType = ({
    functionName,
    type
}) => {
    return templates.warning_unsupported_function_for_type({
        functionName,
        type,
    });
};
export const invalidSvgValue = value => {
    return templates.error_bad_svg_format({
        propertyName: 'src',
        value,
    });
};
export const invalidMenuItemMessage = ({
    propertyName,
    value,
    index,
}) => {
    return assert.isNumber(index) ?
        templates.error_bad_menu_item_format_with_index({
            propertyName,
            value,
            index,
        }) :
        templates.error_bad_menu_item_format({
            propertyName,
            value,
        });
};
export const invalidOption = ({
    propertyName,
    wrongValue,
    index
}) => templates.warning_invalid_option({
    propertyName,
    wrongValue,
    index,
});
export const onlyGetter = ({
    propertyName,
    compType
}) => templates.error_only_getter({
    propertyName,
    compType,
});
export const invalidFormatMessageWithHint = ({
    propertyName,
    functionName,
    wrongValue,
    hint
}) => {
    return templates.error_bad_format_with_hint({
        propertyName,
        functionName,
        wrongValue,
        hint,
    });
};
export const invalidObjectFormatWithCustomMessage = ({
    keyName,
    propertyName,
    functionName,
    wrongValue,
    message
}) => {
    return templates.error_object_bad_format({
        keyName,
        propertyName,
        functionName,
        wrongValue,
        message,
    });
};
export const invalidOptionFields = ({
    propertyName,
    wrongValue,
    fields,
    index
}) => templates.error_invalid_option_fields({
    propertyName,
    wrongValue,
    fields,
    index,
});
export const invalidItemLink = ({
    functionName,
    propertyName,
    index
}) => templates.error_item_external_link({
    propertyName,
    functionName,
    index,
});
export const unsupportedPropertyMessageWithHint = ({
    propertyName,
    hint
}) => templates.error_unsupported_property_with_hint({
    propertyName,
    hint,
});
export const nonExistingItem = ({
    functionName,
    propertyName,
    value
}) => templates.error_item_not_found({
    propertyName,
    functionName,
    value,
});
export const invalidArrayLength = ({
    functionName,
    propertyName,
    value,
    arrayLength
}) => templates.error_array_length({
    propertyName,
    functionName,
    value,
    arrayLength,
});
//# sourceMappingURL=messages.js.map