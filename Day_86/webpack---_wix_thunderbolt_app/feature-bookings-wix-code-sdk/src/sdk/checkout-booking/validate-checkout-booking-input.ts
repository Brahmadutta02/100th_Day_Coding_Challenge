import { ValidationErrorCodes } from './checkout-booking.consts'
import { reportError } from '../common/error-handler'

export function validateCheckoutBooking(service, numberOfSpots, formFields) {
	validateFields(service.form.fields, formFields)
	validateCapacity(numberOfSpots, service)
}

function isNumberOfParticipants(fieldType) {
	return fieldType === 'NUMBER_OF_PARTICIPANTS'
}

function isCapacityRequired(defaultFormFields) {
	return defaultFormFields.some((filed) => isNumberOfParticipants(filed.fieldType))
}

function isRequestedSpotsBiggerThanAllowedSpots(maxParticipantsPerBooking, requestedSpots) {
	return maxParticipantsPerBooking < requestedSpots
}

function validateCapacity(numberOfSpots, service) {
	const requestedSpots = numberOfSpots || 1
	if (
		isCapacityRequired(service.form.fields) &&
		isRequestedSpotsBiggerThanAllowedSpots(service.policy.maxParticipantsPerBooking, requestedSpots)
	) {
		reportError(ValidationErrorCodes.OVER_CAPACITY, 'Max number of participants per booking exceeded')
	}
}

function isRequiredField(field) {
	return !isNumberOfParticipants(field.fieldType) && field.userConstraints && field.userConstraints.required
}

function getRequiredFields(serviceFields: Array<any>) {
	let required: Array<any> = []
	serviceFields.forEach((field) => {
		if (field.subFields && field.subFields.length > 0) {
			required = required.concat(getRequiredFields(field.subFields))
		} else if (isRequiredField(field)) {
			required.push(field)
		}
	})
	return required
}

function isRequiredFieldEmpty(requiredField, formFields) {
	const formInput = formFields.find((field) => field._id === requiredField.fieldId)
	return !formInput.value
}

function isRequiredFieldFound(requiredField, formFields) {
	return formFields.find((field) => field._id === requiredField.fieldId) !== undefined
}

function validateFields(serviceFields, formFields) {
	const requiredFields = getRequiredFields(serviceFields)
	requiredFields.forEach((requiredField: any) => {
		if (!isRequiredFieldFound(requiredField, formFields) || isRequiredFieldEmpty(requiredField, formFields)) {
			reportError(ValidationErrorCodes.MISSING_FIELD, `${requiredField.label} field is missing`)
		}
	})
}
