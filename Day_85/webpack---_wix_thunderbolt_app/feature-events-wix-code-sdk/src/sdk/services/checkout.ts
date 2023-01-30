import { EventsApi } from '../utils/api'
import { removeNumberPropFromInputs } from '../utils/formatting'
import { CheckoutResponseCorvid, OrderCorvid, UpdateOrderResponseCorvid } from '../types/types'
import { omit } from 'lodash'
import { GetInvoiceResponse, InputValue, Order } from '@wix/ambassador-wix-events-web/types'

export const checkout = async (
	eventId: string,
	reservationId: string,
	{ guest, couponCode }: { guest: Array<InputValue>; couponCode: string }
): Promise<CheckoutResponseCorvid> => {
	const result = await (await EventsApi()).CheckoutService().checkout({
		eventId,
		reservationId,
		guests: [{ form: { inputValues: guest } }],
		discount: couponCode ? { couponCode } : null,
	})

	return {
		...omit(result, 'expires'),
		expirationTime: new Date(result.expires),
		order: formatOrder(result.order),
	}
}

export const updateOrder = async (
	eventId: string,
	orderNumber: string,
	{ guest }: { guest: Array<InputValue> }
): Promise<UpdateOrderResponseCorvid> => {
	const result = await (await EventsApi())
		.CheckoutService()
		.updateCheckout({ eventId, orderNumber, guests: [{ form: { inputValues: guest } }] })
	return {
		order: formatOrder(result.order),
	}
}

export const verifyCoupon = async (
	eventId: string,
	reservationId: string,
	couponCode: string
): Promise<GetInvoiceResponse> => {
	return (await EventsApi()).CheckoutService().getInvoice({
		eventId,
		reservationId,
		withDiscount: { couponCode },
	})
}

const formatOrder = (order: Order): OrderCorvid => ({
	...omit(order, ['created', 'snapshotId', 'method', 'ticketsQuantity', 'totalPrice']),
	paymentId: order.snapshotId,
	createdDate: new Date(order.created),
	checkoutForm: removeNumberPropFromInputs(order.checkoutForm),
	paymentMethod: order.method,
	ticketQuantity: order.ticketsQuantity,
	price: order.totalPrice,
})
