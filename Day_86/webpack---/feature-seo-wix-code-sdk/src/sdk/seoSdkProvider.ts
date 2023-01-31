import { SeoWixCodeSdkHandlers } from '../types'
import { SeoSiteSymbol, ISeoSiteApi } from 'feature-seo'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider } from '@wix/thunderbolt-symbols'

export const seoWixCodeSdkHandlersProvider = withDependencies(
	[SeoSiteSymbol],
	(seoApi: ISeoSiteApi): SdkHandlersProvider<SeoWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			seo: {
				async setTitle(title) {
					await seoApi.setVeloTitle(title)
				},
				async setLinks(links) {
					await seoApi.setVeloLinks(links)
				},
				async setMetaTags(metaTags) {
					await seoApi.setVeloMetaTags(metaTags)
				},
				async setStructuredData(structuredData) {
					await seoApi.setVeloStructuredData(structuredData)
				},
				async setSeoStatusCode(seoStatusCode) {
					await seoApi.setVeloSeoStatusCode(seoStatusCode)
				},
				async renderSEOTags(payload) {
					await seoApi.setVeloSeoTags(payload)
				},
				async resetSEOTags() {
					await seoApi.resetVeloSeoTags()
				},
				async onTPAOverrideChanged(cb) {
					return seoApi.onTPAOverridesChanged(cb)
				},
			},
		}),
	})
)
