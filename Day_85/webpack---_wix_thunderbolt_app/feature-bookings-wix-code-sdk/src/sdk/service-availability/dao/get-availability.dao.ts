import { get } from '../../common/api'
import { mapAvailabilityOptionsToAvailabilityRequest } from '../service-availability.mapper'
import { validateGeneralStatus, validateStatus } from '../../common/error-handler'

export function getAvailability(serviceId, availabilityOptions) {
	if (!serviceId || typeof serviceId !== 'string') {
		throw new TypeError('serviceId is not defined or is not of type string')
	}
	const apiUrl = `/service/${serviceId}/availability`
	const mappedOptions = mapAvailabilityOptionsToAvailabilityRequest(availabilityOptions)
	return get(apiUrl, mappedOptions)
		.then((res) => validateGeneralStatus(res))
		.then((res) => res.json())
		.then((res) => validateStatus(res))
}
