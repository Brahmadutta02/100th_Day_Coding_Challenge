import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { IPageResourceFetcher, PageResourceFetcherSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { ILightboxesLinkUtilsAPI, LightboxesLinkUtilsAPISymbol } from 'feature-lightbox'
import { IMultilingualLinkUtilsAPI, MultilingualLinkUtilsAPISymbol } from 'feature-multilingual'
import { getSiteMap } from './utils/siteMap'
import type { ISiteMap } from './types'

export const SiteMap = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		RoutingLinkUtilsAPISymbol,
		PageResourceFetcherSymbol,
		optional(LightboxesLinkUtilsAPISymbol),
		optional(MultilingualLinkUtilsAPISymbol),
	],
	(
		tpaCommonsSiteConfig: TpaCommonsSiteConfig,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		pageResourceFetcher: IPageResourceFetcher,
		popupsLinkUtilsAPI: ILightboxesLinkUtilsAPI,
		multilingualLinkUtilsAPI?: IMultilingualLinkUtilsAPI
	): ISiteMap => ({
		getSiteMap: async () => {
			const siteMapItems = await pageResourceFetcher.fetchResource('masterPage', 'siteMap')

			return getSiteMap(
				siteMapItems,
				tpaCommonsSiteConfig,
				routingLinkUtilsAPI,
				popupsLinkUtilsAPI,
				multilingualLinkUtilsAPI
			)
		},
	})
)
