import { HttpRequestInit, HttpResponse } from '@wix/site-assets-client'
import { FetchFn } from '@wix/thunderbolt-symbols'

const toObject = (pairs: Array<Array<string>>) => {
	return Array.from(pairs).reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})
}

export function toSiteAssetsHttpClient(requestUrl: string, fetchFn: FetchFn, siteAssetsServerUrl: string) {
	return {
		fetch: (url: string, init?: HttpRequestInit): Promise<HttpResponse> => {
			// Needed for local env for site assets dev server only
			const shouldSendSiteUrlHeader =
				siteAssetsServerUrl.includes('localhost') &&
				url.includes('localhost') &&
				url.includes('pages/thunderbolt')

			const safeInit: HttpRequestInit = init
				? {
						...init,
						// TODO move to use Object.fromEntries instead of toObject once we upgrade to supporting ECMA version
						headers: toObject(
							Object.entries(init.headers).filter(
								(header: [string, string]) => !header[0].toLowerCase().startsWith('content-type')
							)
						),
				  }
				: { headers: {}, method: 'GET' }

			const headersWithSiteUrl: Record<string, string> = {
				...safeInit.headers,
				siteurl: requestUrl,
			}

			return fetchFn(url, {
				headers: shouldSendSiteUrlHeader ? headersWithSiteUrl : safeInit.headers,
				method: safeInit.method,
			})
		},
	}
}
