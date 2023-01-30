import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { createCurrencies } from '../currencies/currencies'
import { PaymentOptions, PaymentResult } from '../types'
import { validate } from '../validations'
import { namespace, PaymentsWixCodeSdkWixCodeApi } from '..'
import { getOpenModalConfig } from './openModalConfig'
import { getPaymentResults } from './getPaymentResults'
import { createBiLogger } from './bi'
import { createFedopsLogger } from './fedops'

const consoleErrorPrefix = 'WixPay.startPayment: '
const cashierAppDefinitionId = '14bca956-e09f-f4d6-14d7-466cb3f09103'
export function PaymentsSdkFactory({
	platformUtils,
	platformEnvData,
	wixCodeNamespacesRegistry,
}: WixCodeApiFactoryArgs): { [namespace]: PaymentsWixCodeSdkWixCodeApi } {
	const { biUtils, sessionService, essentials } = platformUtils

	return {
		[namespace]: {
			startPayment(paymentId: string, opts: PaymentOptions) {
				const instance = sessionService.getInstance(cashierAppDefinitionId)
				const startTime = Date.now()
				const options = {
					showThankYouPage: true,
					skipUserInfoPage: false,
					...opts,
				}
				const biLogger = createBiLogger({
					biUtils,
					instance,
					options,
					paymentId,
				})
				const fedopsLogger = createFedopsLogger(essentials, biUtils)
				const origin = new URL(platformEnvData.location.externalBaseUrl).origin

				fedopsLogger.logALE()
				biLogger.logOpenModal()

				if (options.userInfo) {
					console.warn(
						`${consoleErrorPrefix}userInfo is deprecated. Pass user information to createPayment instead.`
					)
				}

				return new Promise<PaymentResult>((resolve, reject) => {
					const config = getOpenModalConfig(paymentId, instance, options, {
						startTime,
					})
					if (
						!validate({
							paymentId,
							options,
						})
					) {
						return reject(`${consoleErrorPrefix}invalid arguments`)
					}

					wixCodeNamespacesRegistry
						.get('window')
						.openModal(config.url, config.options)
						.then(() =>
							resolve(
								getPaymentResults({
									paymentId,
									origin,
									appInstance: instance,
								})
							)
						)
						.catch((e) => {
							biLogger.logOpenModalCompleteFailure(e, startTime)
							throw e
						})

					biLogger.logOpenModalCompleteSuccess(startTime)
				})
			},
			currencies: createCurrencies({ getInstance: sessionService.getInstance }),
		},
	}
}
