export const templates = {
    /* prettier-ignore */
    warning_not_null: ({
        propertyName,
        functionName
    }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to null.`,
    /* prettier-ignore */
    warning_non_images_in_gallery: ({
        galleryId
    }) => `Gallery "${galleryId}" cannot contain items that are not images. To also display video and text, choose a gallery that supports those types.`,
    /* prettier-ignore */
    warning_invalid_effect_name: ({
        propertyName,
        compName,
        effectName,
        infoLink
    }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it is an invalid effectName value. Read more about effects: "${infoLink}"')`,
    /* prettier-ignore */
    warning_invalid_effect_option: ({
        propertyName,
        compName,
        effectName,
        effectOption,
        effectOptionRef
    }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions keys: ${effectOption}. Read more about the effectOptions object: "https://www.wix.com/code/reference/$w.EffectOptions.html#${effectOptionRef}"`,
    /* prettier-ignore */
    warning_effect_options_not_set: ({
        propertyName,
        compName,
        infoLink
    }) => `The "${propertyName}" function called on "${compName}" was executed without the specified effect options because it was called without an effect. Read more about effects: "${infoLink}"')`,
    /* prettier-ignore */
    warning_invalid_effect_options: ({
        propertyName,
        compName,
        effectName,
        wrongProperty,
        wrongValue,
        infoLink
    }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions ${wrongProperty}: ${wrongValue}. Read more about the effectOptions object: "${infoLink}"')`,
    /* prettier-ignore */
    warning_deprecated_effect_name: ({
        propertyName,
        compName,
        effectName,
        infoLink
    }) => `The "${propertyName}" function  called on "${compName}" was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"')`,
    /* prettier-ignore */
    warning_deprecated_effect_with_options: ({
        propertyName,
        compName,
        effectName,
        infoLink
    }) => `The "${propertyName}" function  called on "${compName}" was executed without the specified effect options because it was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"`,
    /* prettier-ignore */
    warning_invalid_type_effect_options: ({
        propertyName,
        compName,
        effectName,
        wrongValue,
        infoLink
    }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because the it was called with the following invalid effectOptions "${wrongValue}". The effectOptions must be of type Object. Read more about the effectOptions object: "${infoLink}"'`,
    /* prettier-ignore */
    error_bad_image_format_with_index: ({
        propertyName,
        wrongValue,
        index
    }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${wrongValue}". It must be a valid URL starting with "http://", "https://", or "wix:image://".`,
    /* prettier-ignore */
    error_invalid_type_for_file_limit: ({
        propertyName
    }) => `The ${propertyName} property is not yet supported for Document or Audio file types.`,
    /* prettier-ignore */
    warning_not_null_for_comp_name: ({
        propertyName,
        functionName,
        compName
    }) => `The ${propertyName} parameter of "${compName}" that is passed to the ${functionName} method cannot be set to null.`,
    /* prettier-ignore */
    warning_not_null_with_index: ({
        propertyName,
        functionName,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to null or undefined.`,
    /* prettier-ignore */
    warning_invalid_option: ({
        propertyName,
        wrongValue,
        index
    }) => `The ${propertyName} parameter at index ${index} that is passed to the options function cannot be set to ${JSON.stringify(wrongValue)}. Options must contain either a non-null value or a non-null label.`,
    /* prettier-ignore */
    warning_color_casting_performed: ({
        propertyName,
        compName,
        infoLink
    }) => ` The value of "${propertyName}" property of "${compName}" expects an rgbColor value, but was set to an rgbaColor value. The color value has been set, but the alpha opacity information has been ignored. Read more about rgbColor values: "${infoLink}"`,
    /* prettier-ignore */
    warning_value_changed: ({
        propertyName,
        compName,
        newValue,
        changedProperty
    }) => `The ${propertyName} of ${compName} was set to ${newValue}, which is less than ${compName}'s ${changedProperty} value. ${compName} cannot have a ${changedProperty} value which is greater than its ${propertyName} value. The value of ${changedProperty} has therefore been set to ${newValue}.`,
    /* prettier-ignore */
    warning_at_least: ({
        propertyName,
        wrongValue,
        minValue
    }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at least ${minValue}.`,
    /* prettier-ignore */
    warning_at_most: ({
        propertyName,
        wrongValue,
        maxValue
    }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at most ${maxValue}.`,
    /* prettier-ignore */
    error_mandatory_val: ({
        propertyName,
        functionName
    }) => `The ${propertyName} parameter is required for ${functionName} method.`,
    /* prettier-ignore */
    error_mandatory_val_with_index: ({
        propertyName,
        functionName,
        index
    }) => `The ${propertyName} parameter of item at index ${index} is required for ${functionName} method.`,
    /* prettier-ignore */
    error_length_in_range: ({
        propertyName,
        functionName,
        value,
        minimum,
        maximum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
    /* prettier-ignore */
    error_length_in_range_with_index: ({
        propertyName,
        functionName,
        value,
        minimum,
        maximum,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
    /* prettier-ignore */
    error_length_accept_single_value: ({
        propertyName,
        functionName,
        value,
        expectedValue
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
    /* prettier-ignore */
    error_length_accept_single_value_with_index: ({
        propertyName,
        functionName,
        value,
        expectedValue,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
    /* prettier-ignore */
    error_length_less_than: ({
        propertyName,
        functionName,
        value,
        minimum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
    /* prettier-ignore */
    error_length_less_than_with_index: ({
        propertyName,
        functionName,
        value,
        minimum,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
    /* prettier-ignore */
    error_length_exceeds: ({
        propertyName,
        functionName,
        value,
        maximum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
    /* prettier-ignore */
    error_length_exceeds_with_index: ({
        propertyName,
        functionName,
        value,
        maximum,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
    /* prettier-ignore */
    error_range: ({
        propertyName,
        functionName,
        value,
        minimum,
        maximum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
    /* prettier-ignore */
    error_range_with_index: ({
        propertyName,
        functionName,
        value,
        minimum,
        maximum,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
    /* prettier-ignore */
    error_accept_single_value: ({
        propertyName,
        functionName,
        value,
        expectedValue
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
    /* prettier-ignore */
    error_accept_single_value_with_index: ({
        propertyName,
        functionName,
        value,
        expectedValue,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
    /* prettier-ignore */
    error_larger_than: ({
        propertyName,
        functionName,
        value,
        minimum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
    /* prettier-ignore */
    error_at_least: ({
        propertyName,
        functionName,
        value,
        minimum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be at least ${minimum}.`,
    /* prettier-ignore */
    error_larger_than_with_index: ({
        propertyName,
        functionName,
        value,
        minimum,
        index
    }) => `The value of ${propertyName} parameter of item at ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
    /* prettier-ignore */
    error_less_than: ({
        propertyName,
        functionName,
        value,
        maximum
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
    /* prettier-ignore */
    error_less_than_with_index: ({
        propertyName,
        functionName,
        value,
        maximum,
        index
    }) => `The value of ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
    /* prettier-ignore */
    error_type: ({
        propertyName,
        functionName,
        value,
        expectedType
    }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
    /* prettier-ignore */
    error_type_with_index: ({
        propertyName,
        functionName,
        value,
        expectedType,
        index
    }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
    /* prettier-ignore */
    error_bad_format: ({
        propertyName,
        functionName,
        value
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Bad format`,
    /* prettier-ignore */
    error_effects_input: ({
        functionName,
        wrongEffects,
        allowedEffects
    }) => `Passed  effects: "${wrongEffects.join('", "')}" to the ${functionName} method are wrong for this element. Allowed effects are: "${allowedEffects.join('", "')}".`,
    /* prettier-ignore */
    error_slide_input: ({
        propertyName,
        functionName,
        slideShowId,
        value,
        minimum,
        maximum
    }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a slide from the "${slideShowId}" slideshow or an index between ${minimum} and ${maximum}`,
    /* prettier-ignore */
    error_state_input: ({
        propertyName,
        functionName,
        stateBoxId,
        value
    }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a state from the "${stateBoxId}" statebox`,
    /* prettier-ignore */
    error_bad_format_with_index: ({
        propertyName,
        functionName,
        value,
        index
    }) => `The "${propertyName}" property of the item at index ${index} that is passed to the ${functionName} method cannot be set to "${value}". Bad format`,
    /* prettier-ignore */
    error_bad_format_with_hint: ({
        propertyName,
        functionName,
        wrongValue,
        hint
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. Bad format, must be ${hint} format.`,
    /* prettier-ignore */
    error_object_bad_format: ({
        keyName,
        propertyName,
        functionName,
        wrongValue,
        message
    }) => `The value of ${keyName} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
    /* prettier-ignore */
    error_object_bad_format_with_index: ({
        keyName,
        propertyName,
        index,
        functionName,
        wrongValue,
        message
    }) => `The value of ${keyName} of item at index ${index} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
    /* prettier-ignore */
    error_bad_svg_format: ({
        propertyName,
        value
    }) => (`The "${propertyName}" property cannot be set to "${value}". It must be a valid SVG XML string or an SVG source starting with "http://", "https://", or "wix:vector://v1/".`),
    /* prettier-ignore */
    error_target_w_photo: ({
        target
    }) => `The target parameter that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank,_self).`,
    /* prettier-ignore */
    error_menu_items_target: ({
        target,
        label,
        index
    }) => `The target parameter of the item with the label ${label} nested under the item at index ${index} that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank, _self).`,
    /* prettier-ignore */
    error_menu_items_depth: ({
        labelValue,
        maxLevels
    }) => `The menuItems parameter with the label "${labelValue}" that is passed to the menuItems method cannot be nested at this level. Menus can be ${maxLevels} levels deep.`,
    /* prettier-ignore */
    error_menu_items_label: ({
        index
    }) => `The value of the label parameter of the item at index ${index} that is passed to the label cannot be set to the value undefined, null, or an empty string, unless a label can be inferred from the item link's page title.`,
    /* prettier-ignore */
    error_bad_menu_item_format: ({
        propertyName,
        value
    }) => `The "${propertyName}" property cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2".`,
    /* prettier-ignore */
    error_bad_menu_item_format_with_index: ({
        propertyName,
        value,
        index
    }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2"`,
    /* prettier-ignore */
    error_invalid_css_value: ({
        propertyName,
        compName,
        cssProperty,
        exampleFormat,
        infoLink
    }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in the following format:"${exampleFormat}". Read more about "${cssProperty}" values: "${infoLink}"`,
    /* prettier-ignore */
    error_invalid_css_value_multiple_expected_formats: ({
        propertyName,
        compName,
        cssProperty,
        exampleFormats,
        infoLink
    }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in one of the following formats:"${exampleFormats}". Read more about "${cssProperty}" values: "${infoLink}"`,
    /* prettier-ignore */
    error_invalid_location: ({
        propertyName,
        index,
        wrongValue
    }) => `The ${propertyName} parameter at index ${index} that is passed to the markers function cannot be set to ${wrongValue}. You need to set either location object {longitude, latitude}, or a valid address - placeId.`,
    /* prettier-ignore */
    error_invalid_markers: ({
        wrongValue
    }) => `The markers property cannot be set to ${wrongValue}. You need to set at least one marker in the array.`,
    /* prettier-ignore */
    error_only_getter: ({
        propertyName,
        compType
    }) => `Cannot set property ${propertyName} of ${compType} which has only a getter.`,
    /* prettier-ignore */
    error_invalid_url: ({
        url,
        type,
        prefix
    }) => `The "src" property cannot be set to "${url}". It must be a valid URL starting with "http://", "https://", or a valid ${type} URL starting with ${prefix}.`,
    /* prettier-ignore */
    error_supported_link_type_with_index: ({
        functionName,
        wrongValue,
        index
    }) => `The link property of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${wrongValue}" as this is not a supported link type.`,
    /* prettier-ignore */
    error_invalid_target_with_index: ({
        functionName,
        wrongValue,
        index
    }) => `The target parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. It must be of type from (_blank,_self).`,
    /* prettier-ignore */
    warning_unsupported_function_for_type: ({
        functionName,
        type
    }) => `'${functionName}' is not supported for an element of type: ${type}.`,
    /* prettier-ignore */
    error_bad_iana_timezone: ({
        timeZoneIANA
    }) => `Invalid IANA time zone specified: "${timeZoneIANA}"`,
    /* prettier-ignore */
    error_invalid_option_fields: ({
        propertyName,
        wrongValue,
        fields,
        index
    }) => `The ${propertyName} at index ${index} cannot be set to ${JSON.stringify(wrongValue)}. Options must contain at least a non-null ${fields[0]} or a non-null ${fields[1]}.`,
    /* prettier-ignore */
    error_item_external_link: ({
        propertyName,
        functionName,
        index
    }) => `The ${propertyName} of the ${functionName} parameter of item at index ${index} that is passed to the items method cannot be an external link. It must be a link to a page on your site.`,
    /* prettier-ignore */
    error_unsupported_property_with_hint: ({
        propertyName,
        hint
    }) => `The ${propertyName} parameter cannot be set when ${hint}`,
    /* prettier-ignore */
    error_item_not_found: ({
        propertyName,
        functionName,
        value
    }) => `The ${propertyName} parameter with value ${value} that is passed to the ${functionName} method is not found.`,
    /* prettier-ignore */
    error_array_length: ({
        propertyName,
        functionName,
        value,
        arrayLength
    }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Its length must be at least ${arrayLength}.`,
};
//# sourceMappingURL=messageTemplates.js.map