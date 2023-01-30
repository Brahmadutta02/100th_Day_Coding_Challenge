import {
    validateByType,
    validateLength
} from './validate'
import {
    logSdkError
} from '@wix/thunderbolt-commons'
import {
    error_type
} from './errors'

const functionName = 'startPayment'

// Migrate to validation utils from platform
// https://jira.wixpress.com/browse/PLAT-500
export function validate({
    paymentId,
    options
}) {
    let valid = true
    const {
        userInfo,
        showThankYouPage,
        skipUserInfoPage,
        termsAndConditionsLink,
        allowManualPayment,
        forceSkipUserInfoPage,
        skipContactCreation,
    } = options

    const typeRules = [{
            acceptNil: false,
            propertyName: 'paymentId',
            value: paymentId,
            expectedType: 'string'
        },
        {
            acceptNil: true,
            propertyName: 'options',
            value: options,
            expectedType: 'object'
        },
        {
            acceptNil: true,
            propertyName: 'userInfo',
            value: userInfo,
            expectedType: 'object'
        },
        {
            acceptNil: true,
            propertyName: 'showThankYouPage',
            value: showThankYouPage,
            expectedType: 'boolean',
        },
        {
            acceptNil: true,
            propertyName: 'skipUserInfoPage',
            value: skipUserInfoPage,
            expectedType: 'boolean',
        },
        {
            acceptNil: true,
            propertyName: 'termsAndConditionsLink',
            value: termsAndConditionsLink,
            expectedType: 'string',
        },
        {
            acceptNil: true,
            propertyName: 'allowManualPayment',
            value: allowManualPayment,
            expectedType: 'boolean',
        },
        {
            acceptNil: true,
            propertyName: 'forceSkipUserInfoPage',
            value: forceSkipUserInfoPage,
            expectedType: 'boolean',
        },
        {
            acceptNil: true,
            propertyName: 'skipContactCreation',
            value: skipContactCreation,
            expectedType: 'boolean',
        },
    ]
    typeRules.forEach(({
        propertyName,
        value,
        expectedType,
        acceptNil
    }) => {
        if (!validateByType({
                value,
                expectedType,
                acceptNil
            })) {
            valid = false
            logSdkError(error_type({
                propertyName,
                functionName,
                wrongValue: value,
                expectedType
            }))
            return
        }
    })
    if (!validateLength({
            propertyName: paymentId,
            value: paymentId,
            minLength: 1,
            maxLength: 256,
            functionName
        })) {
        return false
    }
    return valid
}