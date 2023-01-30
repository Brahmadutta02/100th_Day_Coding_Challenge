import { EVENTS_API_PATH_AMBASSADOR } from '../constants'
import { loadAmbassadorWixEventsWebHttp } from '../dynamic-imports'

type GetHeadersCallback = () => HeadersInit

let getRequestHeaders: GetHeadersCallback

export const prepareEventsApi = (getHeaders: GetHeadersCallback) => {
	getRequestHeaders = getHeaders
}

export const EventsApi = async () => {
	const api = (await loadAmbassadorWixEventsWebHttp()).WixEventsWeb(EVENTS_API_PATH_AMBASSADOR)
	return {
		RsvpManagement: () => api.RsvpManagement()(getRequestHeaders()),
		EventManagement: () => api.EventManagement()(getRequestHeaders()),
		CheckoutService: () => api.CheckoutService()(getRequestHeaders()),
	}
}
