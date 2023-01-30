import { PaymentOptionType } from '../common/checkout.consts'
import { getCheckoutOptionType } from '../common/checkout.mapper'
import { CheckoutMethod } from './checkout-options.types'

export function mapPaymentOptionDTOToCheckoutOption(paymentOption): CheckoutMethod {
	if (isPaidPlanType(paymentOption.type)) {
		return mapPaidPlanDTOToCheckoutOption(paymentOption)
	}
	return {
		type: getCheckoutOptionType(paymentOption.type),
	}
}

function isPaidPlanType(paymentOptionType) {
	return paymentOptionType === PaymentOptionType.PACKAGE || paymentOptionType === PaymentOptionType.MEMBERSHIP
}

function mapPaidPlanDTOToCheckoutOption(paidPlan): CheckoutMethod {
	return {
		type: getCheckoutOptionType(paidPlan.type),
		planName: paidPlan.planName,
		planOrderId: paidPlan.planOrderId,
		planExpiration: paidPlan.planExpiration,
		benefitId: paidPlan.benefitId,
		remainingCredits: paidPlan.remainingCredits,
		totalCredits: paidPlan.totalCredits,
	}
}
