export const GENERAL_ERROR = 'GENERAL_ERROR'

const errorsMapping = {
	500: 'BOOKINGS_SYSTEM_ERROR',
}

export function requestError(code, message) {
	return { code, message }
}

export function validateGeneralStatus(response) {
	if (!response.ok) {
		return response
			.json()
			.then((parsedBody) => {
				const { code, message } = getErrorFromBody(parsedBody, response.status)
				reportError(Number(code), message)
			})
			.catch((e) => {
				if (e.code && e.message) {
					throw e
				}
				const code = response.status
				const message = errorsMapping[response.status] || GENERAL_ERROR
				reportError(code, message)
			})
	}
	return response
}

function getErrorFromBody(responseError, responseStatus) {
	const errors = responseError.errors
	const error = errors && errors.length > 0 && errors[0]
	return error || { code: responseStatus, message: GENERAL_ERROR }
}

// for old platform when the http request returns 200
export function validateStatus(response) {
	const errors = response.errors
	if (errors && errors.length > 0) {
		reportError(errors[0].code, errors[0].message)
	}
	return response
}

export function reportError(errorCode, errorMessage) {
	throw requestError(errorCode, errorMessage)
}
