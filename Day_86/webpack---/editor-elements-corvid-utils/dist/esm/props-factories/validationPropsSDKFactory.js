import {
    getCustomValidityMessage,
    getValidationData,
    setCustomValidator,
    setValidationData,
} from '../inputUtils';
import {
    withValidation
} from '../validations';
export const createValidationPropsSDKFactory = (inputValidator) => {
    inputValidator.onValidate(({
        viewerSdkAPI,
        validationDataResult,
        showValidityIndication,
    }) => {
        const {
            setProps,
            compRef
        } = viewerSdkAPI;
        const prevValidationData = getValidationData(viewerSdkAPI);
        const prevCustomValidityMessage = getCustomValidityMessage(prevValidationData);
        const customValidityMessage = getCustomValidityMessage(validationDataResult);
        const prevHtmlValidationMessageOverrideKey = prevValidationData.htmlValidationMessageOverride.key;
        const htmlValidationMessageOverrideKey = validationDataResult.htmlValidationMessageOverride.key;
        if (validationDataResult.validity.customError) {
            if (prevCustomValidityMessage !== customValidityMessage) {
                compRef.setCustomValidity({
                    type: 'message',
                    message: customValidityMessage,
                });
            }
        } else if (htmlValidationMessageOverrideKey) {
            if (prevValidationData.validity.customError ||
                prevHtmlValidationMessageOverrideKey !==
                htmlValidationMessageOverrideKey) {
                compRef.setCustomValidity({
                    type: 'key',
                    key: htmlValidationMessageOverrideKey,
                });
            }
        } else if (prevCustomValidityMessage !== customValidityMessage ||
            prevHtmlValidationMessageOverrideKey !==
            htmlValidationMessageOverrideKey) {
            compRef.setCustomValidity({
                type: 'message',
                message: '',
            });
        }
        const compProps = Object.assign({
            isValid: validationDataResult.validity.valid
        }, (showValidityIndication && {
            shouldShowValidityIndication: true
        }));
        setValidationData(viewerSdkAPI, validationDataResult);
        setProps(compProps);
    });
    const _validationPropsSDKFactory = api => {
        const {
            setProps,
            props,
            registerEvent,
            metaData: {
                isRepeaterTemplate
            },
        } = api;
        // We don't want to register events on a repeater template
        // since the validation will use the template props
        if (!isRepeaterTemplate) {
            registerEvent('validateValue', () => {
                inputValidator.validate({
                    viewerSdkAPI: api
                });
            });
            // We get props override because sometimes props are not updated the way we expect them to be.
            // For example - Checkbox's onChange from the controller updatesProps with the latest checked value. We expect to have these updated props here in validateValueAndShowIndication
            // That is called right after onChange, but in Safari that is not the case. For now we are passing props overrides.
            // Ticket - https://jira.wixpress.com/browse/PLAT-934. PR to revert after the fix (Don't revert the onChange radioGroup changes!) - https://github.com/wix-private/editor-elements/pull/2584
            registerEvent('validateValueAndShowIndication', (propsOverrides) => {
                const updatedProps = Object.assign(Object.assign({}, props), propsOverrides);
                const viewerSdkAPI = Object.assign(Object.assign({}, api), {
                    props: updatedProps
                });
                inputValidator.validate({
                    viewerSdkAPI,
                    showValidityIndication: true,
                });
            });
            registerEvent('hideValidityIndication', () => {
                setProps({
                    shouldShowValidityIndication: false
                });
            });
            inputValidator.validate({
                viewerSdkAPI: api,
                showValidityIndication: false,
            });
        }
        return {
            get valid() {
                return getValidationData(api).validity.valid;
            },
            get validationMessage() {
                return getValidationData(api).validationMessage;
            },
            get validity() {
                return getValidationData(api).validity;
            },
            onCustomValidation(validator, override = true) {
                setCustomValidator(api, validator, override);
                inputValidator.validate({
                    viewerSdkAPI: api,
                });
            },
            updateValidityIndication() {
                setProps({
                    shouldShowValidityIndication: true
                });
            },
            resetValidityIndication() {
                setProps({
                    shouldShowValidityIndication: false
                });
            },
        };
    };
    return withValidation(_validationPropsSDKFactory, {
        type: ['object'],
        properties: {
            onCustomValidation: {
                type: ['function'],
                args: [{
                    type: ['function']
                }, {
                    type: ['boolean']
                }],
            },
        },
    });
};
//# sourceMappingURL=validationPropsSDKFactory.js.map