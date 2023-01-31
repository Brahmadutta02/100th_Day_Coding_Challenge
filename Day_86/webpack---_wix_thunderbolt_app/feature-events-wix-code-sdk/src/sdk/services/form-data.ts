import { pick } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { rsvpStatusIsNotYes } from '../helpers'
import { MAIN_FIELDS } from '../constants'
import { isDevEnvironment } from '../utils/environment'
import { FormData, LegacyFormData, RegistrationForm } from '../types/types'
import { getEvent } from './event'
import { EventType, Event, Input, InputControl, RsvpStatus } from '@wix/ambassador-wix-events-web/types'

export const formatRegistrationFormDataLegacy = (rsvpData: FormData): LegacyFormData => ({
	rsvpStatusOptions: rsvpData.rsvpStatusOptions,
	registrationStatus: rsvpData.registrationStatus,
	rsvpFormInputs: rsvpData.formInputs,
	isTicketed: rsvpData.isTicketed,
})

export const getRegistrationFormData = async (eventId: string): Promise<FormData> => {
	const event = await getEvent(eventId)
	if (!event) {
		throw new Error(`Event with the id: ${eventId} not found`)
	}
	const isTicketed = event.registration.type === EventType.TICKETS
	const formInputs = extractFormFields(event)
	const {
		registration: {
			status: registrationStatus,
			rsvpCollection: {
				config: { rsvpStatusOptions },
			},
		},
	} = event
	const formData: FormData = {
		formInputs,
		registrationStatus,
		isTicketed,
	}
	if (!isTicketed) {
		formData.rsvpStatusOptions = rsvpStatusOptions
	}
	return formData
}

export const getInputNames = (rsvpFormInputs: RegistrationForm, rsvpStatus: RsvpStatus) => {
	return rsvpStatusIsNotYes(rsvpStatus) ? MAIN_FIELDS : Object.keys(rsvpFormInputs).concat('rsvpStatus')
}

const extractFormFields = (event: Event) => {
	const {
		form: { controls },
	} = event
	return controls.reduce((acc, control) => {
		return control.inputs.reduce((inputObjects, input) => [...inputObjects, createInputObject(input, control)], acc)
	}, [])
}

const createInputObject = (input: Input, control: InputControl) => {
	const name = input.name.replace(/[-]/, '')
	const _id = isDevEnvironment() ? '123' : uuidv4()
	return {
		...pick(input, ['array', 'label', 'options', 'maxLength']),
		additionalLabels: extractAdditionalLabels(input.additionalLabels),
		required: input.mandatory,
		controlType: control.type,
		name,
		_id,
	}
}

const extractAdditionalLabels = (additionalLabels: { [k: string]: string }) => {
	return Object.entries(additionalLabels).map(([name, label]) => ({
		name,
		label,
	}))
}
