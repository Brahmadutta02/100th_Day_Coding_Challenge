import { convertDynamicPageModel, setExternalRouter } from '@wix/advanced-seo-utils/renderer-api'
import { resolveMetaTags } from './resolve-meta-tags'
import { DynamicRouteData } from '@wix/thunderbolt-symbols'
import { MetaTag } from 'feature-seo'

export const extractDynamicRouteData = (
	payload: DynamicRouteData,
	mediaItemUtils: any,
	currentVeloOverrides: Array<MetaTag> = []
) => {
	if (payload) {
		const { pageHeadData = {} } = payload
		const resolvedPageHeadData = {
			...pageHeadData,
			metaTags: resolveMetaTags(pageHeadData.metaTags || {}, mediaItemUtils),
		}
		const veloOverrides = setExternalRouter(currentVeloOverrides, resolvedPageHeadData)
		const dynamicPageData = convertDynamicPageModel(resolvedPageHeadData)
		return {
			veloOverrides,
			dynamicPageData,
		}
	}
}
