import { getSlotPaymentOptionsByUserId } from './dao/get-slot-payment.dao'
import { mapPaymentOptionDTOToCheckoutOption } from './checkout-options.mapper'
import { CheckoutOptionsOptions, GetCheckoutOptionsResponse } from './checkout-options.types'

export async function getCheckoutOptions({
	slotId,
	userId,
}: CheckoutOptionsOptions): Promise<GetCheckoutOptionsResponse> {
	const slotPaymentOptions = await getSlotPaymentOptionsByUserId(slotId, userId)
	return {
		checkoutMethods: slotPaymentOptions.map(mapPaymentOptionDTOToCheckoutOption),
	}
}
