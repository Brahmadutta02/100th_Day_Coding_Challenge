import { reportError } from '../../common/error-handler'

export const wixPayErrorsMapping = {
	500: 'WIX_PAY_SYSTEM_ERROR',
}

export function payWithWixPay(snapshotOrderId: string, wixCodeNamespacesRegistry) {
	return wixCodeNamespacesRegistry
		.get('pay')
		.startPayment(snapshotOrderId, { showThankYouPage: false })
		.catch((err) => reportError(wixPayErrorsMapping[500], err))
}
