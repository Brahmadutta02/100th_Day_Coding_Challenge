import { get } from '../api'

export function getServiceById(serviceId) {
	const apiUrl = `/service/${serviceId}`
	return get(apiUrl)
		.then((res) => res.json())
		.then(({ service }) => service)
}
