import { availbilityOptionsTypeErrors, defaultPagingOptions } from './service-availability.const'
import { AvailabilityOptions, GetServiceAvailabilityResponse, Slot } from './service-avaialbility.types'
import { mapSlotLocationDtoToSlotLocation } from './mappers/location-mapper'

function mapSlotDTOsToSlot(slotDTO): Slot {
	return {
		_id: slotDTO.id,
		startDateTime: mapStringToDate(slotDTO.start),
		endDateTime: mapStringToDate(slotDTO.end),
		serviceId: slotDTO.serviceId,
		capacity: slotDTO.capacity,
		remainingSpots: slotDTO.remainingSpots || 0,
		staffMemberId: slotDTO.staffId,
		bookable: slotDTO.bookable,
		constraints: slotDTO.constraints,
		...(slotDTO.location ? { location: mapSlotLocationDtoToSlotLocation(slotDTO.location) } : {}),
	}
}

function mapStringToDate(timeString) {
	return new Date(timeString)
}

function mapDateToString(date) {
	return date.toISOString()
}

function isDateObject(date) {
	return Object.prototype.toString.call(date) === '[object Date]'
}

function validateAvailabilityOptionsTypes(availabilityOptions) {
	if (
		(availabilityOptions.startDateTime && !isDateObject(availabilityOptions.startDateTime)) ||
		(availabilityOptions.endDateTime && !isDateObject(availabilityOptions.endDateTime))
	) {
		throw new TypeError(availbilityOptionsTypeErrors.dateTypeError)
	}
}

export function mapServiceAvailabilityDTOsToServiceAvailability(availabilityResponse): GetServiceAvailabilityResponse {
	return {
		slots: availabilityResponse.slots.map((slot) => mapSlotDTOsToSlot(slot)),
	}
}

export function mapAvailabilityOptionsToAvailabilityRequest(availabilityOptions: AvailabilityOptions) {
	validateAvailabilityOptionsTypes(availabilityOptions)
	const from = availabilityOptions.startDateTime ? { from: mapDateToString(availabilityOptions.startDateTime) } : {}
	const to = availabilityOptions.endDateTime ? { to: mapDateToString(availabilityOptions.endDateTime) } : {}
	const locations =
		availabilityOptions.locationIds && availabilityOptions.locationIds.length
			? { locations: availabilityOptions.locationIds }
			: {}
	const paging = defaultPagingOptions

	return {
		...from,
		...to,
		...paging,
		...locations,
	}
}
