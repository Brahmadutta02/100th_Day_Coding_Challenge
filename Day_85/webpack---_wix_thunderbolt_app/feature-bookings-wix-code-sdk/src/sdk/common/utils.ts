export function mapQueryParamsToQueryString(queryParams) {
	const queryArray: Array<string> = []
	Object.keys(queryParams).forEach((key) => {
		queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
	})
	return queryArray.join('&')
}
