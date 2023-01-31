import { isUndefined } from 'lodash'
import {
	CustomInputValidationError,
	FormSubmissionError,
	FormSubmissionErrors,
	getFormSubmissionErrorMessage,
	InputValidationErrorTypes,
	InvalidFieldIdError,
	MissingFieldsError,
} from '../custom-errors'
import {
	formContainsUserAddedField,
	getFieldsWithInvalidIds,
	getMissingFields,
	groupInputsByName,
	isEmptyArray,
	isEmptyString,
	isRegistrationClosed,
	prepareArray,
	prepareValue,
	rsvpStatusIsNotYes,
} from '../helpers'
import { VALID_RSVP_STATUSES } from '../constants'
import { EditorControl, FormData, RegistrationForm } from '../types/types'
import { getInputNames } from './form-data'
import {
	InputControlType,
	RegistrationStatus,
	RsvpStatus,
	RsvpStatusOptions,
} from '@wix/ambassador-wix-events-web/types'

const {
	EMPTY_INPUT,
	INVALID_INPUT_VALUE,
	TOO_LONG_INPUT,
	INVALID_OPTION,
	INVALID_NUMBER_OF_GUESTS,
	INVALID_STATUS,
} = InputValidationErrorTypes

const { REGISTRATION_CLOSED } = FormSubmissionErrors

interface ValidationHandlers {
	email(inputValue: string): void
	phone(inputValue: string, inputId: string): void
	date(inputValue: string, inputId: string): void
	guestNames(guestNames: Array<string>): void
	singleValueSelection(value: string): void
	multipleValueSelection(values: Array<string>): void
	validateEmptyInput(value: any, inputId: string): void
	validateMaxLength(value: string): void
	defaultValidation(value: any, inputId: string): void
}

interface ConditionedHandler {
	condition: boolean
	handler(value: any, inputId: string): void
}

export class ValidationService {
	groupedInputs: { [key: string]: EditorControl }

	constructor(private readonly rsvpData: FormData) {
		this.groupedInputs = groupInputsByName(rsvpData.formInputs)
	}

	validate = (editorInputs: RegistrationForm) => {
		const validators = [
			this.checkIfNotClosed,
			!this.rsvpData.isTicketed && this.validateStatus,
			!this.rsvpData.isTicketed && this.validateFormWithMainFields,
			this.checkForIncorrectFieldIds,
			this.checkForMissingFields,
			this.validateInputValues,
		]
		validators.forEach((validator) => (validator ? validator(editorInputs) : true))
		return { valid: true }
	}

	checkIfNotClosed = () => {
		const { registrationStatus } = this.rsvpData
		if (isRegistrationClosed(registrationStatus)) {
			const errorMessage = getFormSubmissionErrorMessage(REGISTRATION_CLOSED)
			throw new FormSubmissionError(errorMessage, REGISTRATION_CLOSED)
		}
		return { valid: true }
	}

	validateStatus = (editorInputs: RegistrationForm) => {
		const { rsvpStatus } = editorInputs
		const { rsvpStatusOptions, registrationStatus } = this.rsvpData
		if (!VALID_RSVP_STATUSES.includes(rsvpStatus)) {
			throw new CustomInputValidationError('Invalid RSVP status', 'rsvpStatus', INVALID_STATUS)
		}
		if (rsvpStatus === RsvpStatus.YES && registrationStatus === RegistrationStatus.OPEN_RSVP_WAITLIST) {
			throw new CustomInputValidationError(
				'Guest limit is reached. Rsvp response should be "WAITING" or "NO"',
				'rsvpStatus',
				INVALID_STATUS
			)
		}
		if (rsvpStatus === RsvpStatus.NO && rsvpStatusOptions !== RsvpStatusOptions.YES_AND_NO) {
			throw new CustomInputValidationError(
				'Invalid RSVP status: "NO" status is not enabled in the dashboard',
				'rsvpStatus',
				INVALID_STATUS
			)
		}
		if (rsvpStatus === RsvpStatus.WAITING && registrationStatus !== RegistrationStatus.OPEN_RSVP_WAITLIST) {
			throw new CustomInputValidationError(
				'WAITING status can be used when waitlist is enabled in the dashboard and guest limit is reached',
				'rsvpStatus',
				INVALID_STATUS
			)
		}
		return { valid: true }
	}

	validateFormWithMainFields = (editorInputs: RegistrationForm) => {
		const { rsvpStatus } = editorInputs
		if (rsvpStatusIsNotYes(rsvpStatus) && formContainsUserAddedField(editorInputs)) {
			throw new Error(`Form with ${rsvpStatus} response should only contain firstName, lastName and email fields`)
		}
		return { valid: true }
	}

	getInputNames = (editorInputs: RegistrationForm) => {
		if (this.rsvpData.isTicketed) {
			return Object.keys(this.groupedInputs)
		}
		{
			const { rsvpStatus } = editorInputs
			return getInputNames(this.groupedInputs, rsvpStatus)
		}
	}

	checkForIncorrectFieldIds = (editorInputs: RegistrationForm) => {
		const rsvpInputNames = this.getInputNames(editorInputs)
		const editorInputIds = Object.keys(editorInputs)
		const fieldsWithInvalidIds = getFieldsWithInvalidIds(rsvpInputNames, editorInputIds)
		if (fieldsWithInvalidIds.length) {
			throw new InvalidFieldIdError(
				`Following fields have invalid IDs: ${fieldsWithInvalidIds.join(', ')}`,
				fieldsWithInvalidIds
			)
		}
		return { valid: true }
	}

	checkForMissingFields = (editorInputs: RegistrationForm) => {
		const rsvpInputNames = this.getInputNames(editorInputs)
		const editorInputIds = Object.keys(editorInputs)
		const missingFields = getMissingFields(rsvpInputNames, editorInputIds)
		if (missingFields.length) {
			throw new MissingFieldsError(`Following fields are missing: ${missingFields.join(', ')}`, missingFields)
		}
		return { valid: true }
	}

	validateInputValues = (editorInputs: RegistrationForm) => {
		return Object.keys(editorInputs).forEach((inputId) => this.validateInput(inputId, editorInputs))
	}

	validateInput(inputId: string, editorInputs: RegistrationForm) {
		if (!editorInputs.hasOwnProperty(inputId)) {
			throw new Error(`Invalid input Id: ${inputId}`)
		}
		const inputValue = editorInputs[inputId]
		const rsvpInputDetails = this.groupedInputs[inputId] || ({} as EditorControl)
		const validationHandlers = this.getInputValidationHandlers(rsvpInputDetails, editorInputs, inputId)
		const validations = this.getInputValidations(validationHandlers, rsvpInputDetails, inputId)
		return this.runInputValidations(validations, inputValue, inputId)
	}

	getInputValidationHandlers(rsvpInputDetails: EditorControl, editorInputs: RegistrationForm, editorInputId: string) {
		const { required, maxLength, label, options } = rsvpInputDetails
		const { additionalGuests } = editorInputs

		const handlers: ValidationHandlers = {
			email: (inputValue: string) => {
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
					throw new CustomInputValidationError('Invalid email', 'email', INVALID_INPUT_VALUE)
				}
			},
			phone: (inputValue: string, inputId = 'phone') => {
				if (!/^[0-9()+\-\s]{0,25}$/.test(inputValue)) {
					throw new CustomInputValidationError('Invalid phone number', inputId, INVALID_INPUT_VALUE)
				}
			},
			date: (inputValue: string, inputId = 'date') => {
				const date = new Date(inputValue)
				if (isNaN(date.getTime())) {
					throw new CustomInputValidationError('Invalid date', inputId, INVALID_INPUT_VALUE)
				}
			},
			guestNames: (guestNames: Array<string>) => {
				guestNames = prepareArray(guestNames)

				if (guestNames.length) {
					if (!Array.isArray(guestNames)) {
						throw new CustomInputValidationError(
							'GuestNames must be an array',
							'guestNames',
							INVALID_INPUT_VALUE
						)
					}
					if (!additionalGuests) {
						throw new CustomInputValidationError(
							'Number of additional guests not set',
							editorInputId,
							INVALID_NUMBER_OF_GUESTS
						)
					}
					if (Number(additionalGuests) !== guestNames.length) {
						throw new CustomInputValidationError(
							'Number of additional guests incorrect',
							editorInputId,
							INVALID_NUMBER_OF_GUESTS
						)
					}
				}
			},
			singleValueSelection: (value: string) => {
				if (!options.includes(value)) {
					throw new CustomInputValidationError(
						`${value} is not a valid option for ${label}`,
						editorInputId,
						INVALID_OPTION
					)
				}
			},
			multipleValueSelection: (values: Array<string>) => {
				values.forEach((value) => {
					handlers.singleValueSelection(value)
				})
			},
			validateEmptyInput: (value: any, inputId: string) => {
				if (required) {
					if (inputId === 'guestNames') {
						if (isEmptyArray(value) && Number(additionalGuests) !== 0) {
							throw new CustomInputValidationError('Guest names are required', inputId, EMPTY_INPUT)
						}
					} else if (isEmptyString(value) || isEmptyArray(value) || isUndefined(value)) {
						throw new CustomInputValidationError(`${label} is required`, inputId, EMPTY_INPUT)
					}
				}
			},
			validateMaxLength: (value: string) => {
				if (maxLength && value && value.length > maxLength) {
					throw new CustomInputValidationError(
						`${label} cannot be longer than ${maxLength} characters`,
						editorInputId,
						TOO_LONG_INPUT
					)
				}
			},
			defaultValidation: (value: any, inputId: string) => {
				value = prepareValue(value)
				handlers.validateEmptyInput(value, inputId)
				handlers.validateMaxLength(value)
			},
		}
		return handlers
	}

	getInputValidations(
		validationHandlers: ValidationHandlers,
		rsvpInputDetails: EditorControl,
		inputId: string
	): Array<ConditionedHandler> {
		const { controlType } = rsvpInputDetails
		return [
			{
				condition: true,
				handler: validationHandlers.defaultValidation,
			},
			{
				condition:
					controlType === InputControlType.DROPDOWN ||
					inputId === 'additionalGuests' ||
					controlType === InputControlType.RADIO,
				handler: validationHandlers.singleValueSelection,
			},
			{
				condition: controlType === InputControlType.CHECKBOX,
				handler: validationHandlers.multipleValueSelection,
			},
			{
				condition: this.findInputValidationHandler(validationHandlers, inputId) || false,
				handler: (inputValue: any) => {
					const validationHandler = this.findInputValidationHandler(validationHandlers, inputId)
					return validationHandler(inputValue, inputId)
				},
			},
		]
	}

	runInputValidations(validations: Array<ConditionedHandler>, inputValue: any, inputId: string) {
		validations.forEach(({ condition, handler }) => (condition ? handler(inputValue, inputId) : true))
		return { valid: true }
	}

	findInputValidationHandler(validationHandlers: ValidationHandlers, inputId: string) {
		const [, handler] =
			Object.entries(validationHandlers).find(([handlerName]) => inputId.startsWith(handlerName)) || []
		return handler
	}
}
