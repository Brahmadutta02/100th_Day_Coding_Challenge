import { get } from '../../common/api'
import { validateStatus, validateGeneralStatus } from '../../common/error-handler'

export function getSlotPaymentOptionsByUserId(slotId, userId?) {
	const apiUrl = `/paymentOptions/${slotId}${userId ? `/${userId}` : ''}`

	return get(apiUrl)
		.then((res) => validateGeneralStatus(res))
		.then((res) => res.json())
		.then((res) => validateStatus(res))
		.then(({ paymentOptions }) => paymentOptions)
}
