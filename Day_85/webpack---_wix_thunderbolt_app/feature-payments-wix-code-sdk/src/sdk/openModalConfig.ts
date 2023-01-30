import * as urlUtils from './url'
import { OpenModalQuery, PaymentOptions, PaymentUserInfo } from '../types'

export const cashierUrl = 'https://cashier.wixapps.net'
export const cashierServiceUrl = `${cashierUrl}/payment_app`
export const cashierAppDefinitionId = '14bca956-e09f-f4d6-14d7-466cb3f09103'

export const getOpenModalConfig = (
	paymentId: string,
	instance: string,
	options: PaymentOptions,
	loadInfo: { startTime: number }
) => {
	const query: OpenModalQuery = {
		instance,
		snapshotId: paymentId,
		theme: 'modal',
	}

	if (options.termsAndConditionsLink) {
		query.termsAndConditionsLink = options.termsAndConditionsLink
	}

	// PayApp BI Params passed from PayButton
	if (options.pbId) {
		query.pbId = options.pbId
	}
	if (options.pbOrigin) {
		query.pbOrigin = options.pbOrigin
	}
	if (options.sessionId) {
		query.sessionId = options.sessionId
	}

	if (!options.showThankYouPage) {
		query.showThankYouPage = false
	}

	if (options.skipUserInfoPage) {
		query.skipUserInfoPage = true
	}

	if (options.userInfo) {
		query.userInfo = {} as PaymentUserInfo
		for (const [key, value] of Object.entries(options.userInfo)) {
			query.userInfo[key as keyof PaymentUserInfo] = encodeURIComponent(value || '')
		}
	}

	if (loadInfo) {
		query.loadInfo = loadInfo
	}

	// private params, used by Wix TPAs (e.g. Wix Forms)
	if (options.allowManualPayment) {
		query.allowManualPayment = true
	}

	if (options.forceSkipUserInfoPage) {
		query.forceSkipUserInfoPage = true
	}

	if (options.skipContactCreation) {
		query.skipContactCreation = true
	}

	const queryStr = urlUtils.stringifyUrlParams(query)
	const url = `${cashierServiceUrl}?${queryStr}`
	return {
		url,
		options: {
			width: 720,
			height: 800,
			theme: 'BARE',
		},
	}
}
