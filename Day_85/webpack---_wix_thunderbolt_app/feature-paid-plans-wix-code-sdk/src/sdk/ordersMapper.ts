const timestampToDateOrUndefined = (timestamp: number) => (timestamp ? new Date(timestamp) : undefined)

export function mapApiOrderToCorvidOrder(order: any) {
	const { price } = order
	const { validFor } = order

	return {
		id: order.id,
		planId: order.planId,
		memberId: order.memberId,
		roleId: order.roleId,
		orderType: order.orderType,
		status: order.status,
		wixPayOrderId: order.cashierOrderId,
		paymentStatus: order.paymentStatus,
		price: {
			amount: Number(price.amount),
			currency: price.currency,
		},
		planName: order.planName,
		planDescription: order.planDescription,
		recurring: order.recurring,
		freeTrialDays: order.freeTrialDays,
		validFor: {
			forever: validFor.forever,
			period: validFor.period ? { amount: validFor.period.amount, unit: validFor.period.unit } : {},
		},
		validFrom: timestampToDateOrUndefined(order.validFrom),
		validUntil: timestampToDateOrUndefined(order.validUntil),
		dateCreated: timestampToDateOrUndefined(order.dateCreated),
		cancellationReason: order.cancellationReason,
		cancellationInitiator: order.cancellationInitiator,
	}
}
