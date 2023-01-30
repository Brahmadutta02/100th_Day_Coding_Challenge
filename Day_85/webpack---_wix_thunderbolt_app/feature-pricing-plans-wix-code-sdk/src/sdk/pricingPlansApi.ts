import { V2OrdersOrder } from '@wix/ambassador-membership-api/types'
import { CancellationEffectiveAt, ListOrdersRequest, Order } from '@wix/ambassador-pricing-plans-member-orders/types'

import { PricingPlansAmbassador } from './pricingPlansAmbassador'

export type CancellationEffectiveAtEnum =
	| CancellationEffectiveAt.IMMEDIATELY
	| CancellationEffectiveAt.NEXT_PAYMENT_DATE

export class PricingPlansApi {
	constructor(private readonly ambassador: PricingPlansAmbassador) {}

	startOnlineOrder = async (planId: string, startDate?: Date): Promise<V2OrdersOrder> => {
		const response = await (await this.ambassador.checkoutService()).createOnlineOrder({ planId, startDate })
		return response.order!
	}

	requestMemberOrderCancellation = async (id: string, effectiveAt: CancellationEffectiveAtEnum): Promise<void> => {
		if (
			effectiveAt !== CancellationEffectiveAt.IMMEDIATELY &&
			effectiveAt !== CancellationEffectiveAt.NEXT_PAYMENT_DATE
		) {
			throw new Error('effectiveAt must be either IMMEDIATELY or NEXT_PAYMENT_DATE')
		}
		await (await this.ambassador.memberOrdersService()).requestCancellation({ id, effectiveAt })
	}

	listCurrentMemberOrders = async (options: ListOrdersRequest): Promise<Array<Order>> => {
		const response = await (await this.ambassador.memberOrdersService()).listOrders(options)
		return response.orders!
	}
}
