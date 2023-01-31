import { PaymentOptions, CreateBiLoggerParams } from '../types'

export const createBiLogger = ({ biUtils, instance, paymentId, options }: CreateBiLoggerParams) => {
	const biLoggerFactory = biUtils.createBaseBiLoggerFactory('cashier-ugc')
	const biOpts = prepareBiOptions(instance, paymentId, options)
	const logger = biLoggerFactory.updateDefaults({ src: 64 }).logger()
	return {
		logOpenModal() {
			logger.log({ evid: 208, ...biOpts })
		},
		logOpenModalCompleteSuccess(startTime: number) {
			logger.log({
				evid: 209,
				status: true,
				...biOpts,
				duration: +new Date() - startTime,
			})
		},
		logOpenModalCompleteFailure(e: Error, startTime: number) {
			logger.log({
				evid: 209,
				status: false,
				errorDesc: e.message || e,
				duration: +new Date() - startTime,
				...biOpts,
			})
		},
	}
}

export const prepareBiOptions = (instanceStr: string, paymentId: string, options: PaymentOptions) => {
	const instance = decodeInstanceStr(instanceStr)
	const msid = instance.metaSiteId || null
	const appId = instance.appDefId || null
	const appInstanceId = instance.instanceId || null
	const visitorId = instance.uid || instance.aid || null

	return {
		appId,
		appInstanceId,
		orderSnapshotId: paymentId,
		msid,
		visitorId,
		termsAndConditions: Boolean(options.termsAndConditionsLink),
		showThankYouPage: options.showThankYouPage !== false,
		merchantDefinedFields: Object.keys(options.userInfo || {})
			// @ts-ignore
			.filter((key) => Boolean(options.userInfo[key]))
			.join(','),
	}
}

export const decodeInstanceStr = (instanceStr: string) => {
	try {
		const instance = instanceStr.substring(instanceStr.indexOf('.') + 1)
		return JSON.parse(atob(instance))
	} catch (e) {
		return {}
	}
}
