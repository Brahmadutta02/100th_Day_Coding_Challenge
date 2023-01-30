import { post } from '../../common/api'
import { validateStatus, validateGeneralStatus } from '../../common/error-handler'

export function createBooking(createBookingRequest) {
	const apiUrl = '/booking'
	return post(apiUrl, createBookingRequest)
		.then((res) => validateGeneralStatus(res))
		.then((res) => res.json())
		.then((res) => validateStatus(res))
		.then(({ booking }) => booking)
}
