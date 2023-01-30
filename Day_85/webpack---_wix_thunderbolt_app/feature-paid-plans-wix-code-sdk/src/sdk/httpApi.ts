import { API_BASE_PATH } from './constants'
import { PaidPlansError } from './paidPlansError'

interface ApiUrl {
	protocol: string
	hostname: string
}

export class HttpApi {
	constructor(private apiUrl: ApiUrl, private getInstanceHeader: () => string) {}

	get(url: string) {
		return this.sendRequest(url, 'get')
	}

	post(url: string, body: object) {
		return this.sendRequest(url, 'post', body)
	}

	private async sendRequest(url: string, method: 'get' | 'post', body?: object): Promise<any> {
		const requestOptions = {
			method,
			headers: {
				Authorization: this.getInstanceHeader(),
			},
			body: body ? JSON.stringify(body) : undefined,
		}

		const apiBaseUrl = `${this.apiUrl.protocol}//${this.apiUrl.hostname}${API_BASE_PATH}`

		const response = await fetch(`${apiBaseUrl}${url}`, requestOptions).catch((e) => {
			throw new PaidPlansError(e.status, e.message)
		})

		if (!response.ok) {
			await response
				.text()
				.then(tryParsingJsonMessage)
				.then((message) => {
					throw new PaidPlansError(response.status, message)
				})
		}

		return response.json()
	}
}

function tryParsingJsonMessage(text: string) {
	try {
		return JSON.parse(text).message || text
	} catch (e) {
		return text
	}
}
