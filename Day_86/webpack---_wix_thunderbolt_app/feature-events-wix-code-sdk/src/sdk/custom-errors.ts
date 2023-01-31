export enum InputValidationErrorTypes {
	EMPTY_INPUT = 'EMPTY_INPUT',
	INVALID_INPUT_VALUE = 'INVALID_INPUT_VALUE',
	TOO_LONG_INPUT = 'TOO_LONG_INPUT',
	INVALID_OPTION = 'INVALID_OPTION',
	INVALID_STATUS = 'INVALID_STATUS',
	INVALID_NUMBER_OF_GUESTS = 'INVALID_NUMBER_OF_GUESTS',
}

export enum FormSubmissionErrors {
	REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
	RSVP_CLOSED = 'RSVP_CLOSED',
	WAITING_LIST_UNAVAILABLE = 'WAITING_LIST_UNAVAILABLE',
	GUEST_LIMIT_REACHED = 'GUEST_LIMIT_REACHED',
	MEMBER_ALREADY_REGISTERED = 'MEMBER_ALREADY_REGISTERED',
}

export const FormSubmissionErrorHandlers = {
	REGISTRATION_CLOSED: () => 'Registration is closed',
	RSVP_CLOSED: () => 'RSVP closed',
	WAITING_LIST_UNAVAILABLE: () => 'Waiting list unavailable',
	GUEST_LIMIT_REACHED: ({ max_rsvp_size }: { max_rsvp_size: number }) =>
		`Guest limit exceeded: only ${max_rsvp_size} ${max_rsvp_size < 2 ? 'person' : 'people'} can RSVP`,
	MEMBER_ALREADY_REGISTERED: () => 'Member already registered',
}

export function getFormSubmissionErrorMessage(errorKey: FormSubmissionErrors, details = { max_rsvp_size: 0 }) {
	const errorHandler = FormSubmissionErrorHandlers[errorKey]
	return errorHandler ? errorHandler(details) : null
}

class BaseError extends Error {
	fields: Array<string>

	constructor(message: string, fields: Array<string>) {
		super(message)
		this.fields = fields
	}
}

export class MissingFieldsError extends BaseError {
	constructor(message: string, fields: Array<string>) {
		super(message, fields)
		Object.setPrototypeOf(this, MissingFieldsError.prototype)
	}
}

export class InvalidFieldIdError extends BaseError {
	constructor(message: string, fields: Array<string>) {
		super(message, fields)
		Object.setPrototypeOf(this, InvalidFieldIdError.prototype)
	}
}

export class CustomInputValidationError extends Error {
	inputId: string
	errorType: InputValidationErrorTypes

	constructor(message: string, inputId: string, errorType: InputValidationErrorTypes) {
		super(message)
		this.inputId = inputId
		this.errorType = errorType
	}
}

export class FormSubmissionError extends Error {
	errorType: FormSubmissionErrors

	constructor(message: string, errorType: FormSubmissionErrors) {
		super(message)
		this.errorType = errorType
	}
}
