import { Headers } from 'node-fetch'
import { FetchFn } from '@wix/thunderbolt-symbols'
import { Cache } from '@wix/thunderbolt-ssr-api'

const toOKResponse = (text: string): Response => ({
	text: () => Promise.resolve(text),
	json: async () => Promise.resolve(JSON.parse(text)),
	ok: true,
	// @ts-ignore
	headers: new Headers(),
})

export const withCache = (fetchFn: FetchFn, cache: Cache<string, string>): FetchFn => {
	return async (url: string, init?: RequestInit): Promise<Response> => {
		const fromCache = cache.get(url)
		if (fromCache) {
			return Promise.resolve(toOKResponse(fromCache))
		}

		const result = await fetchFn(url, init)

		if (result.ok) {
			const textResult = await result.text()
			if (textResult) {
				cache.set(url, textResult)
				return Promise.resolve(toOKResponse(textResult))
			}
		}
		return Promise.resolve(result)
	}
}

export const NoopCache: () => Cache<string, string> = () => ({
	get(): string | undefined {
		return undefined
	},
	set(): void {},
	values: () => [],
	itemCount: 0,
})
