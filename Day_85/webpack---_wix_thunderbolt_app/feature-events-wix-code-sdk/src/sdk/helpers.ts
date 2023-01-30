import { MAIN_FIELDS } from './constants'
import { FormSubmissionErrors } from './custom-errors'
import { EditorControl, EditorInputs, RegistrationForm } from './types/types'
import { RegistrationStatus, RsvpStatus } from '@wix/ambassador-wix-events-web/types'

export const isEmptyArray = (value: Array<any>) => Array.isArray(value) && value.length === 0
export const isEmptyString = (value: string) => value.length === 0
export const rsvpStatusIsNotYes = (rsvpStatus: RsvpStatus) =>
	rsvpStatus === RsvpStatus.NO || rsvpStatus === RsvpStatus.WAITING
export const isRegistrationClosed = (status: RegistrationStatus) =>
	status === RegistrationStatus.CLOSED_MANUALLY || status === RegistrationStatus.CLOSED
export const prepareString = (value: any) => (typeof value === 'string' ? value.trim() : value)
export const prepareArray = (value: Array<any>) =>
	Array.isArray(value) ? value.map(prepareString).filter(Boolean) : value
export const prepareAddress = (value: any) => (value && value.formatted !== undefined ? value.formatted : value)

export const prepareValue = (value: any) => {
	return [prepareString, prepareAddress, prepareArray].reduce((v, fn) => fn(v), value)
}

export const formContainsUserAddedField = (editorInputs: RegistrationForm) => {
	return Object.keys(editorInputs).some((inputId) => !MAIN_FIELDS.includes(inputId))
}

export const convertInputsToMap = (inputs: EditorInputs | RegistrationForm): RegistrationForm => {
	return Array.isArray(inputs)
		? inputs.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
		: { ...inputs }
}

export const groupInputsByName = (inputs: Array<EditorControl>) => {
	return inputs.reduce((acc, inputObj) => ({ ...acc, [inputObj.name]: inputObj }), {})
}

export const findFormSubmissionErrorType = (errorKey: string): FormSubmissionErrors => {
	return Object.keys(FormSubmissionErrors).find((key) => key === errorKey) as FormSubmissionErrors
}

export const getFieldsWithInvalidIds = (rsvpInputNames: Array<string>, editorInputIds: Array<string>) => {
	return editorInputIds.filter((rsvpInputName) => !rsvpInputNames.includes(rsvpInputName))
}

export const getMissingFields = (rsvpInputNames: Array<string>, editorInputIds: Array<string>) => {
	return rsvpInputNames.filter((rsvpInputName) => !editorInputIds.includes(rsvpInputName))
}
