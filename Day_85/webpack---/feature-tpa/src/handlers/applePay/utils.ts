import { ApiError } from './types'

export const buildError = (code: string, message?: string, error?: Error | unknown): ApiError => {
	return {
		error: {
			errorCode: code,
			message,
			error,
		},
	}
}
