import { ServiceLocation, ServiceLocationType } from '@wix/bookings-uou-types'
import { SlotLocation } from '../service-avaialbility.types'

export function mapSlotLocationDtoToSlotLocation(slotLocationDto: ServiceLocation): SlotLocation {
	const businessLocation = slotLocationDto.businessLocation
	const showLocationText = slotLocationDto.type === ServiceLocationType.OWNER_CUSTOM && slotLocationDto.locationText
	const showBusinessLocation =
		slotLocationDto.type === ServiceLocationType.OWNER_BUSINESS && slotLocationDto.businessLocation
	return {
		type: slotLocationDto.type,
		...(showLocationText ? { locationText: slotLocationDto.locationText } : {}),
		...(showBusinessLocation
			? {
					businessLocation: {
						id: businessLocation?.id,
						name: businessLocation?.name,
						description: businessLocation?.description,
						...(businessLocation?.address
							? {
									address: {
										formatted: businessLocation?.address?.formattedAddress,
										location: businessLocation?.address?.geocode,
										streetAddress: {
											name: businessLocation?.address?.streetAddress?.name,
											number: businessLocation?.address?.streetAddress?.number,
										},
										city: businessLocation?.address?.city,
										subdivision: businessLocation?.address?.subdivision,
										country: businessLocation?.address?.country,
										postalCode: businessLocation?.address?.postalCode,
									},
							  }
							: {}),
					},
			  }
			: {}),
	}
}
