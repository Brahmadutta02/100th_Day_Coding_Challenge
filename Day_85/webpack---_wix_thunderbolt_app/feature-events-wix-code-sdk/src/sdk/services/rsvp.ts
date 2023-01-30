import { removeNumberPropFromInputs } from '../utils/formatting'
import { FormSubmissionError, getFormSubmissionErrorMessage } from '../custom-errors'
import { RsvpCorvid } from '../types/types'
import { omit } from 'lodash'
import { CreateRsvpRequest, CreateRsvpResponse, FormResponse, RsvpStatus } from '@wix/ambassador-wix-events-web/types'
import { AmbassadorHTTPError } from '@wix/ambassador/dist/src/runtime/http' // eslint-disable-line no-restricted-syntax
import { EventsApi } from '../utils/api'

export const createRsvp = async (eventId: string, form: FormResponse, status: RsvpStatus): Promise<RsvpCorvid> => {
	const request: CreateRsvpRequest = {
		eventId,
		status,
		form,
	}

	return (await EventsApi())
		.RsvpManagement()
		.createRsvp(request)
		.then((response) => handleCreateRsvpSuccess(response))
		.catch((err) => handleCreateRsvpError(err))
}

export const handleCreateRsvpSuccess = (response: CreateRsvpResponse): RsvpCorvid => {
	const { rsvp } = response
	const { rsvpForm } = rsvp

	return {
		...omit(rsvp, ['created', 'modified']),
		createdDate: new Date(rsvp.created),
		updatedDate: new Date(rsvp.modified),
		rsvpForm: removeNumberPropFromInputs(rsvpForm),
	}
}

export const handleCreateRsvpError = (error: AmbassadorHTTPError) => {
	const details = error?.response?.details
	if (details && details.error_key) {
		const { error_key: errorKey } = details
		const errorMessage = getFormSubmissionErrorMessage(errorKey, details) || error.response.message
		throw new FormSubmissionError(errorMessage, errorKey)
	}
	throw error
}
