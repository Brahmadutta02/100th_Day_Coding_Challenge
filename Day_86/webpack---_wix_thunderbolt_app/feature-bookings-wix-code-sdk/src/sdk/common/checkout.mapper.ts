import { CheckoutOptionType, PaymentOptionType } from './checkout.consts'

export function getCheckoutOptionType(paymentOption) {
	if (paymentOption === PaymentOptionType.ONLINE) {
		return CheckoutOptionType.WIX_PAY_ONLINE
	} else if (paymentOption === PaymentOptionType.OFFLINE) {
		return CheckoutOptionType.WIX_PAY_OFFLINE
	} else if (paymentOption === PaymentOptionType.MEMBERSHIP) {
		return CheckoutOptionType.MEMBERSHIP
	} else if (paymentOption === PaymentOptionType.PACKAGE) {
		return CheckoutOptionType.PACKAGE
	}
	return undefined
}

export function getPaymentType(checkoutOptionType) {
	if (checkoutOptionType === CheckoutOptionType.WIX_PAY_ONLINE) {
		return PaymentOptionType.ONLINE
	} else if (checkoutOptionType === CheckoutOptionType.WIX_PAY_OFFLINE) {
		return PaymentOptionType.OFFLINE
	} else if (checkoutOptionType === CheckoutOptionType.MEMBERSHIP) {
		return PaymentOptionType.MEMBERSHIP
	} else if (checkoutOptionType === CheckoutOptionType.PACKAGE) {
		return PaymentOptionType.PACKAGE
	}
	return undefined
}
