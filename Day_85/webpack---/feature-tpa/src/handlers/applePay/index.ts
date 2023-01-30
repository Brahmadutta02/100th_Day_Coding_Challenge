import { withDependencies } from '@wix/thunderbolt-ioc'
import { loadPmRpc } from '@wix/thunderbolt-commons'
import { ViewerModel, ViewerModelSym, TpaHandlerExtras } from '@wix/thunderbolt-symbols'
import { buildError } from './utils'
import type {
	ApiError,
	ApplePayErrorConstructorParams,
	ApplePayRpcApi,
	InvokeMethodParams,
	StartSessionParams,
} from './types'

const APPLE_PAY_IS_NOT_AVAILABLE_ERROR = 'APPLE_PAY_IS_NOT_AVAILABLE_ERROR'
const BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR'
const WIX_ERROR = 'WIX_ERROR'

export const wrapWithApplePayCheck = <T extends Function>(fn: T): (() => ApiError) => {
	return (...args) => {
		if (!window.ApplePaySession) {
			return {
				error: {
					errorCode: APPLE_PAY_IS_NOT_AVAILABLE_ERROR,
				},
			}
		}
		if (typeof fn === 'function') {
			return fn(...args)
		}
	}
}

const createApplePayError = (p: ApplePayErrorConstructorParams) => {
	return new window.ApplePayError(p.code, p.contactField, p.message)
}

export const ApplePayHandlers = withDependencies([ViewerModelSym], ({ siteAssets }: ViewerModel) => ({
	getTpaHandlers() {
		const applePayInvokeMethod = async (_id: string, p: InvokeMethodParams) => {
			if (!p.methodName) {
				return buildError(BAD_REQUEST_ERROR)
			}

			switch (p.methodName) {
				case 'canMakePayments': {
					try {
						return {
							result: window.ApplePaySession.canMakePayments(),
						}
					} catch (e) {
						return buildError(WIX_ERROR, 'ApplePaySession.canMakePayments() failed', e)
					}
				}

				case 'supportsVersion': {
					try {
						return {
							result: window.ApplePaySession.supportsVersion(p.payload.version),
						}
					} catch (e) {
						return buildError(WIX_ERROR, `ApplePaySession.supportsVersion(${p.payload.version}) failed`, e)
					}
				}

				default: {
					return buildError(BAD_REQUEST_ERROR)
				}
			}
		}

		const applePayStartSession = async (
			_id: string,
			{ paymentRequest, applePayVersion, callbackApiId }: StartSessionParams,
			extras: TpaHandlerExtras
		): Promise<ApiError | void> => {
			try {
				const session: ApplePaySession = new window.ApplePaySession(applePayVersion, paymentRequest)
				const pmRpc = await loadPmRpc(siteAssets.clientTopology.moduleRepoUrl)
				const target = window.document.querySelector(`#${extras.originCompId} > iframe`)
				/* const target: extras.tpa; // doesn't work because pm-rpc is trying to invoke .contentWindow on it
				/* and it leads to cross origin error */
				if (!target) {
					return buildError(WIX_ERROR, `Can not find a TPA iframe with id: ${extras.originCompId}`)
				}
				const iframeApi = await pmRpc.api.request<ApplePayRpcApi>(callbackApiId, {
					target,
				})

				session.onvalidatemerchant = async (e: ApplePayJS.ApplePayValidateMerchantEvent) => {
					const merchantSession = await iframeApi.onValidateMerchant({ validationURL: e.validationURL })
					return session.completeMerchantValidation(merchantSession)
				}

				session.onshippingcontactselected = async (e: ApplePayJS.ApplePayShippingContactSelectedEvent) => {
					const update = await iframeApi.onShippingContactSelected({ shippingContact: e.shippingContact })
					if (Array.isArray(update.errors)) {
						// ApplePayError can't be structure cloned, so we accept params from widget and create Error in Thunderbolt
						update.errors = update.errors.map((err) => createApplePayError(err))
					}
					return session.completeShippingContactSelection(update)
				}

				session.onshippingmethodselected = async (e: ApplePayJS.ApplePayShippingMethodSelectedEvent) => {
					const update = await iframeApi.onShippingMethodSelected({ shippingMethod: e.shippingMethod })
					return session.completeShippingMethodSelection(update)
				}

				session.onpaymentauthorized = async (e: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
					const result = await iframeApi.onPaymentAuthorized({ payment: e.payment })
					return session.completePayment(result)
				}

				session.oncancel = async () => {
					const result = await iframeApi.onCancel()
					return result
				}

				/*
				 * - Apple Pay API doesn't provide onClick callback
				 * - We should create ApplePaySession on user gesture, otherwise there will be a delay before session creation and we will see an error:
				 *		"InvalidAccessError: Must create a new ApplePaySession from a user gesture handler"
				 * So we invoke onClick between session.begin() and user gesture.
				 */
				const { canceled } = await iframeApi.onClick()

				if (canceled) {
					return
				}

				session.begin()
			} catch (e) {
				return buildError(WIX_ERROR, e?.message, e)
			}
		}

		return {
			applePayInvokeMethod: wrapWithApplePayCheck(applePayInvokeMethod),
			applePayStartSession: wrapWithApplePayCheck(applePayStartSession),
		}
	},
}))
