import { PaymentResult } from '../types'

export const paymentResultsRoute = (paymentId: string): string =>
	`/_serverless/payments-checkout-server/payment-results/${paymentId}`

export const getPaymentResults = ({
	paymentId,
	origin,
	appInstance,
}: {
	paymentId: string
	origin: string
	appInstance: string
}): Promise<PaymentResult> => {
	return fetch(origin + paymentResultsRoute(paymentId), {
		headers: {
			Authorization: appInstance,
		},
	})
		.then((res) => res.json())
		.catch(
			() =>
				(({
					payment: {
						id: paymentId,
					},
					status: 'Undefined',
					transactionId: null,
				} as unknown) as PaymentResult)
		)
}
