import { mapApiOrderToCorvidOrder } from './ordersMapper'
import { HttpApi } from './httpApi'

export class PricingPlansApi {
	constructor(private httpApi: HttpApi) {}

	createOrder = async (planId: string) => {
		const response = await this.httpApi.post('/orders', { planId, useWixPay: true })

		return {
			orderId: response.orderId as string,
			wixPayOrderId: response.wixPayOrderId as string | undefined,
		}
	}

	cancelOrder = async (orderId: string) => {
		await this.httpApi.post(`/orders/${orderId}/cancel`, { orderId })
	}

	getCurrentMemberOrders = async (limit = 50, offset = 0) => {
		const response = await this.httpApi.get(`/orders/my-orders?limit=${limit}&offset=${offset}`)
		return response.orders.map(mapApiOrderToCorvidOrder)
	}
}
