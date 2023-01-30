import { WixSearchInternalRequestData, WixSearchResultData } from '../types'

const SEARCH_BASE_URL = '/_api/search-services-sitesearch'
const REQUEST_TIMEOUT = '3000'

export default class WixSearchClient {
	private _token: string

	constructor(token: string) {
		this._token = token
	}

	async search(request: WixSearchInternalRequestData): Promise<WixSearchResultData> {
		const path = `${SEARCH_BASE_URL}/v1/search`
		const body = JSON.stringify(request)

		const response = await fetch(path, {
			method: 'post',
			headers: {
				timeout: REQUEST_TIMEOUT,
				Authorization: this._token,
			},
			body,
		})

		return response.json()
	}
}
