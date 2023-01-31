import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { getServiceAvailability } from './service-availability/service-availability'
import { getCheckoutOptions } from './checkout-options/checkout-options'
import { checkoutBooking } from './checkout-booking/checkout-booking'
import { namespace, BookingsWixCodeSdkWixCodeApi } from '..'
import { BOOKINGS_APP_DEF_ID } from './common/config'
import { prepareBookingsApi } from './common/api'
import { BookingInfo, PaymentOptions } from './checkout-booking/checkout-booking.types'

export function BookingsSdkFactory({
	platformUtils,
	wixCodeNamespacesRegistry,
}: WixCodeApiFactoryArgs): { [namespace]: BookingsWixCodeSdkWixCodeApi } {
	const { sessionService } = platformUtils
	const getRequestHeaders = () => ({
		Authorization: sessionService.getInstance(BOOKINGS_APP_DEF_ID),
	})
	prepareBookingsApi(getRequestHeaders)

	return {
		[namespace]: {
			getServiceAvailability,
			getCheckoutOptions,
			checkoutBooking: (bookingInfo: BookingInfo, paymentOptions: PaymentOptions) =>
				checkoutBooking(bookingInfo, paymentOptions, wixCodeNamespacesRegistry),
		},
	}
}
