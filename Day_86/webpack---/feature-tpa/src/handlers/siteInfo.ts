import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaMasterPageConfig } from '../types'
import {
	BrowserWindowSymbol,
	BrowserWindow,
	MasterPageFeatureConfigSymbol,
	CurrentRouteInfoSymbol,
	TpaHandlerProvider,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo, UrlHistoryManagerSymbol, IUrlHistoryManager } from 'feature-router'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type SiteInfoResponse = {
	baseUrl: string
	pageTitle: string
	pageTitleOnly: string
	referer: string
	siteDescription: string
	siteKeywords: string
	url: string
}

export const SiteInfoHandler = withDependencies(
	[
		UrlHistoryManagerSymbol,
		CurrentRouteInfoSymbol,
		named(MasterPageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		BrowserWindowSymbol,
	],
	(
		urlHistoryManager: IUrlHistoryManager,
		currentRouteInfo: ICurrentRouteInfo,
		{ pagesData }: TpaMasterPageConfig,
		{ externalBaseUrl }: TpaCommonsSiteConfig,
		window: BrowserWindow
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				siteInfo(): SiteInfoResponse {
					const { pageId } = currentRouteInfo.getCurrentRouteInfo()!
					const { href } = urlHistoryManager.getParsedUrl()
					const { siteDescription, siteKeywords, title } = pagesData[pageId]
					return {
						siteDescription,
						siteKeywords,
						baseUrl: externalBaseUrl,
						pageTitle: window!.document.title,
						pageTitleOnly: title,
						referer: window!.document.referrer,
						url: href,
					}
				},
			}
		},
	})
)
