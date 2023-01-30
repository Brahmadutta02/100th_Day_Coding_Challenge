import { FetchFn, FetchResponse, IFetchApi } from '@wix/thunderbolt-symbols'
import { Cache } from '@wix/thunderbolt-ssr-api'
import { NoopCache, withCache } from './withCache'

function toFormData(payload: any) {
	return Object.keys(payload).reduce((acc, key) => {
		acc.append(key, payload[key])
		return acc
	}, new URLSearchParams())
}

export function FetchApi(requestUrl: string, fetchFn: FetchFn, cache: Cache<string, string> = NoopCache()): IFetchApi {
	function envFetch(url: string, init?: RequestInit) {
		return fetchFn(url, init)
	}

	const cachedFetch = withCache(envFetch, cache)

	return {
		getJson: <T>(url: string): Promise<T> => {
			const options = { headers: { referer: requestUrl } }
			return envFetch(url, options).then((x) => x.json())
		},
		postFormData(url: string, formData: any) {
			const data = toFormData(formData)
			return envFetch(url, {
				method: 'POST',
				body: data,
			}).then((x) => x.json())
		},
		envFetch,
		async getWithCacheInSsr(url: string): Promise<FetchResponse> {
			return cachedFetch(url, { headers: { referer: requestUrl } })
		},
	}
}
