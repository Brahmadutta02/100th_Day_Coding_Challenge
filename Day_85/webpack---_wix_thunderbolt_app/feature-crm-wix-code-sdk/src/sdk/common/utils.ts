import { AddressTag, Address, ContactInfo, Email, Phone } from '../../types'
import { parseMediaItem } from './image-utils'

export interface ContactInfoServerDTO {
	info: {
		name?: {
			first?: string
			last?: string
		}
		company?: string
		jobTitle?: string
		locale?: string
		birthdate?: string
		picture?: {
			image: {
				id?: string
				url?: string
				height?: number
				width?: number
				altText?: string
			}
		}
		emails?: {
			items: Array<Email>
		}
		phones?: {
			items: Array<Phone>
		}
		addresses?: {
			items: Array<AddressServerDTO>
		}
		locations?: {
			items: Array<string>
		}
		labelKeys?: {
			items: Array<string>
		}
		extendedFields?: {
			items: object
		}
	}
}

export interface AddressServerDTO {
	tag?: AddressTag
	address?: {
		country?: string
		subdivision?: string
		city?: string
		postalCode?: string
		streetAddress?: {
			number?: string
			name?: string
		}
		addressLine?: string
		addressLine2?: string
		formattedAddress?: string
		geocode?: {
			latitude: number
			longitude: number
		}
	}
}

const mapAddressToAddressServerDTO = (item: Address): AddressServerDTO => {
	return (
		item && {
			tag: item.tag,
			address: item.address && {
				country: item.address.country,
				subdivision: item.address.subdivision,
				city: item.address.city,
				postalCode: item.address.postalCode,
				streetAddress: item.address.streetAddress,
				addressLine: item.address.addressLine1,
				addressLine2: item.address.addressLine2,
				formattedAddress: item.address.formatted,
				geocode: item.address.location,
			},
		}
	)
}

export const mapContactToServerDTO = (contactInfo: ContactInfo): ContactInfoServerDTO => {
	return (
		contactInfo && {
			info: {
				name: contactInfo.name,
				company: contactInfo.company,
				jobTitle: contactInfo.jobTitle,
				locale: contactInfo.locale,
				birthdate: contactInfo.birthdate,
				picture: contactInfo.profilePicture
					? {
							image: parseMediaItem(contactInfo.profilePicture),
					  }
					: contactInfo.picture?.image
					? {
							image: parseMediaItem(contactInfo.picture.image),
					  }
					: undefined,
				emails: contactInfo.emails && {
					items: contactInfo.emails,
				},
				phones: contactInfo.phones && {
					items: contactInfo.phones,
				},
				addresses: contactInfo.addresses && {
					items: contactInfo.addresses.map(mapAddressToAddressServerDTO),
				},
				locations: contactInfo.locations && {
					items: contactInfo.locations,
				},
				labelKeys: contactInfo.labelKeys && {
					items: contactInfo.labelKeys,
				},
				extendedFields: contactInfo.extendedFields && {
					items: contactInfo.extendedFields,
				},
			},
		}
	)
}
