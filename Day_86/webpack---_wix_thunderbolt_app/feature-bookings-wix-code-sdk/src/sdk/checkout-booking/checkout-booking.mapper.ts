import { CreateBookingStatus, CheckoutBookingStatus, WIX_PAY_SUCCESSFUL_STATUS } from './checkout-booking.consts'
import { getPaymentType } from '../common/checkout.mapper'
import { CheckoutOptionType } from '../common/checkout.consts'

export function mapCheckoutBookingToCreateBookingDTO(bookingInfo, paymentOptions, defaultForm) {
	return {
		serviceId: bookingInfo.slot.serviceId,
		slotId: bookingInfo.slot._id,
		bookingInfo: buildBookingInfo(bookingInfo, defaultForm),
		paymentInfo: paymentOptions ? buildPaymentInfo(paymentOptions) : undefined,
		timezone: bookingInfo.customerTimeZone,
	}
}

function buildBookingInfo(bookingInfo, defaultForm) {
	const numberOfSpots = bookingInfo.numberOfSpots ? bookingInfo.numberOfSpots : 1
	return {
		id: defaultForm.formId,
		fields: buildBookingInfoFields(defaultForm.fields, bookingInfo.formFields, numberOfSpots),
	}
}

function buildBookingInfoFields(defaultFormFields, flatFormFields, numberOfSpots) {
	const bookingInfoFields = []
	defaultFormFields.forEach((defaultField) =>
		buildBookingInfoField(defaultField, flatFormFields, numberOfSpots, bookingInfoFields)
	)
	return bookingInfoFields
}

function buildBookingInfoField(defaultField, flatFormFields, numberOfSpots, bookingInfoFields) {
	if (isSubFieldsExist(defaultField)) {
		const subFields = buildBookingInfoFields(defaultField.subFields, flatFormFields, numberOfSpots)
		pushNestedItemToBookingInfoFields(bookingInfoFields, defaultField.fieldId, subFields)
	} else if (isNumberOfParticipants(defaultField.fieldType)) {
		pushFlatItemToBookingInfoFields(bookingInfoFields, defaultField.fieldId, numberOfSpots.toString())
	} else {
		const field = flatFormFields.find((flatField) => flatField._id === defaultField.fieldId)
		if (field) {
			pushFlatItemToBookingInfoFields(bookingInfoFields, field._id, field.value)
		}
	}
}

function isNumberOfParticipants(fieldType) {
	return fieldType === 'NUMBER_OF_PARTICIPANTS'
}

function isSubFieldsExist(field) {
	return field.subFields && field.subFields.length > 0
}

function pushFlatItemToBookingInfoFields(bookingInfoFields, id, value) {
	bookingInfoFields.push({
		id,
		value,
	})
}

function pushNestedItemToBookingInfoFields(bookingInfoFields, id, subFields) {
	bookingInfoFields.push({
		id,
		subFields,
	})
}

function isPayWithWix(paymentType) {
	return paymentType === CheckoutOptionType.WIX_PAY_ONLINE || paymentType === CheckoutOptionType.WIX_PAY_OFFLINE
}

function isPayWithPlan(paymentType) {
	return paymentType === CheckoutOptionType.PACKAGE || paymentType === CheckoutOptionType.MEMBERSHIP
}

function buildPaymentInfo(paymentOptions) {
	if (isPayWithWix(paymentOptions.paymentType)) {
		return {
			couponCode: paymentOptions.couponCode,
			bookWithWixPay: {
				type: getPaymentType(paymentOptions.paymentType),
			},
		}
	} else if (isPayWithPlan(paymentOptions.paymentType)) {
		return {
			bookWithPricingPlan: {
				type: getPaymentType(paymentOptions.paymentType),
				benefitId: paymentOptions.paidPlan ? paymentOptions.paidPlan.benefitId : '',
				orderId: paymentOptions.paidPlan ? paymentOptions.paidPlan.planOrderId : '',
			},
		}
	}
	return undefined
}

export function mapCreateBookingDTOToCheckoutBookingWithoutPayment(createBookingResponse) {
	return {
		bookingId: createBookingResponse.id,
		status: getCheckoutBookingStatusWithoutPayment(createBookingResponse.status),
	}
}

export function mapCreateBookingDTOToCheckoutBookingWithPayment(createBookingResponse, paymentResult) {
	return {
		bookingId: createBookingResponse.id,
		status: getCheckoutBookingStatusWithPayment(paymentResult.status),
	}
}

function getCheckoutBookingStatusWithPayment(paymentStatus) {
	return WIX_PAY_SUCCESSFUL_STATUS.includes(paymentStatus)
		? CheckoutBookingStatus.CONFIRMED
		: CheckoutBookingStatus.TERMINATED
}

function getCheckoutBookingStatusWithoutPayment(bookingStatus) {
	switch (bookingStatus) {
		case CreateBookingStatus.APPROVED:
			return CheckoutBookingStatus.CONFIRMED
		case CreateBookingStatus.PENDING_APPROVAL:
			return CheckoutBookingStatus.PENDING_APPROVAL
		default:
			return CheckoutBookingStatus.TERMINATED
	}
}
