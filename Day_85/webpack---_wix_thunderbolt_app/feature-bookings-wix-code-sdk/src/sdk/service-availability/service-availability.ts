import { getAvailability } from './dao/get-availability.dao'
import { mapServiceAvailabilityDTOsToServiceAvailability } from './service-availability.mapper'
import { GetServiceAvailabilityResponse } from './service-avaialbility.types'

export async function getServiceAvailability(
	serviceId,
	availabilityOptions = {}
): Promise<GetServiceAvailabilityResponse> {
	const availabilityResponse = await getAvailability(serviceId, availabilityOptions)
	return mapServiceAvailabilityDTOsToServiceAvailability(availabilityResponse)
}
