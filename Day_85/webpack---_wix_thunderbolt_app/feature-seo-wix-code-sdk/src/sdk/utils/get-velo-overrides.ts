import { SeoVeloState } from '../../types'

export const getVeloTags = async (veloOverrides: Partial<SeoVeloState> = {}) => {
	let tags: Array<any> = []
	const api = await import('@wix/advanced-seo-utils/renderer' /* webpackChunkName: "seo-api" */)
	if (veloOverrides.title) {
		tags = api.setTitle(tags, veloOverrides.title)
	}
	if (veloOverrides.links) {
		tags = api.setLinks(tags, veloOverrides.links)
	}
	if (veloOverrides.metaTags) {
		tags = api.setMetaTags(tags, veloOverrides.links)
	}
	if (veloOverrides.structuredData) {
		tags = api.setSchemas(tags, veloOverrides.links)
	}
	return tags
}
