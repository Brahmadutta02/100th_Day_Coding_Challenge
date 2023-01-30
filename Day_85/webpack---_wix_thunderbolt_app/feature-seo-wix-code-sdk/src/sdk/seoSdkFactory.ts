import { DynamicRouteData, SiteWixCodeSdkFactoryData, WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { MetaTag, SiteLevelSeoData } from 'feature-seo'
import { SeoWixCodeSdkFactoryData, SeoWixCodeSdkHandlers, SeoWixCodeSdkWixCodeApi, Link, namespace } from '..'
import { initState } from './utils/generate-state'
import { mediaItemUtils } from '@wix/santa-platform-utils'
import { extractDynamicRouteData } from './utils/extract-dynamic-route-data'
import { resolveMetaTags } from './utils/resolve-meta-tags'

/**
 * SEO SDK Factory
 * API Docs: https://www.wix.com/velo/reference/wix-seo.html
 */

export function SeoSdkFactory({
	featureConfig: pageLevelSeoData,
	handlers,
	platformEnvData,
	onPageWillUnmount,
}: WixCodeApiFactoryArgs<SiteWixCodeSdkFactoryData, SeoWixCodeSdkFactoryData, SeoWixCodeSdkHandlers>): {
	[namespace]: SeoWixCodeSdkWixCodeApi
} {
	const {
		setTitle,
		setLinks,
		setMetaTags,
		setSeoStatusCode,
		setStructuredData,
		renderSEOTags,
		resetSEOTags,
		onTPAOverrideChanged,
	} = handlers.seo
	const siteLevelSeoData = platformEnvData.seo as SiteLevelSeoData
	const dynamicRoutePayload = platformEnvData.router.dynamicRouteData as DynamicRouteData
	const { dynamicPageData, veloOverrides } = extractDynamicRouteData(dynamicRoutePayload, mediaItemUtils) || {}
	const { state, setVeloState, setState } = initState({
		siteLevelSeoData,
		pageLevelSeoData,
		veloOverrides,
		dynamicPageData,
	})

	if (process.env.browser) {
		onTPAOverrideChanged((tpaOverrides) => {
			state.tpaOverrides = tpaOverrides
		}).then(onPageWillUnmount)
	}

	return {
		[namespace]: {
			get title() {
				return state.velo.title
			},
			get links() {
				return state.velo.links
			},
			get metaTags() {
				return state.velo.metaTags
			},
			get structuredData() {
				return state.velo.structuredData
			},
			get seoStatusCode() {
				return state.velo.seoStatusCode
			},
			isInSEO() {
				return siteLevelSeoData.isInSEO
			},
			async setTitle(title: string) {
				setTitle(title)
				setVeloState({ title })
			},
			async setLinks(links: Array<Link>) {
				setLinks(links)
				setVeloState({ links })
			},
			async setMetaTags(metaTags: Array<MetaTag>) {
				const resolvedMetaTags = resolveMetaTags(metaTags, mediaItemUtils) as Array<MetaTag>
				setMetaTags(resolvedMetaTags)
				setVeloState({ metaTags: resolvedMetaTags })
			},
			async setStructuredData(structuredData: Array<Record<string, any>>) {
				setStructuredData(structuredData)
				setVeloState({ structuredData })
			},
			async setSeoStatusCode(seoStatusCode: number) {
				setSeoStatusCode(seoStatusCode)
				setVeloState({ seoStatusCode })
			},
			async renderSEOTags(payload) {
				const { isComponentItemType } = await import(
					'@wix/advanced-seo-utils/renderer' /* webpackChunkName: "seo-api" */
				)

				await renderSEOTags(payload)
				await setState({
					veloState: state.velo,
					...(isComponentItemType(payload?.itemType)
						? {
								componentsItemPayload: [...state.componentsItemPayload, payload],
						  }
						: {
								veloItemPayload: payload,
						  }),
				})
			},
			async resetSEOTags() {
				resetSEOTags()
				await setState({
					veloState: state.userOverrides,
					componentsItemPayload: [],
				})
			},
		},
	}
}
