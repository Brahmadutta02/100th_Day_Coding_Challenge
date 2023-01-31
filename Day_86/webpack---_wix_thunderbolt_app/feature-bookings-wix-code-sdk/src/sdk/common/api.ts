import { mapQueryParamsToQueryString } from './utils'
import { API_BASE_URL } from './config'

type GetHeadersCallback = () => HeadersInit
let getRequestHeaders: GetHeadersCallback

export const prepareBookingsApi = (getHeaders: GetHeadersCallback) => {
	getRequestHeaders = getHeaders
}

export function get(apiUrl, queryParams: any = undefined) {
	const headers = getRequestHeaders()
	const urlSuffix = queryParams ? `?${mapQueryParamsToQueryString(queryParams)}` : ''
	return fetch(`${API_BASE_URL}${apiUrl}${urlSuffix}`, {
		headers,
	})
}

export function post(apiUrl, options, queryParams = undefined) {
	const headers = getRequestHeaders()
	const urlSuffix = queryParams ? `?${mapQueryParamsToQueryString(queryParams)}` : ''
	return fetch(`${API_BASE_URL}${apiUrl}${urlSuffix}`, {
		method: 'post',
		headers,
		body: JSON.stringify(options),
	})
}
