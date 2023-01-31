import { IReporterOptions } from '@wix/thunderbolt-symbols'
import { IReporterApi, ReporterMasterPageConfig } from '.'
import { PageType, ViewerType, PageApp } from './types'
import type { ReporterSiteConfig } from './types'

export function reportPageView({
	masterPageConfig,
	siteConfig,
	reporterApi,
	parsedUrl,
	pageNumber,
	pageId = '',
	reporterOptions = {},
	pageTitle = window.document.title,
}: {
	masterPageConfig: ReporterMasterPageConfig
	siteConfig: ReporterSiteConfig
	reporterApi: IReporterApi
	parsedUrl: URL
	pageNumber: number
	pageId?: string
	reporterOptions?: IReporterOptions
	pageTitle?: string
}): void | undefined {
	const { appPages = {} } = masterPageConfig
	const isTpa = Object.keys(appPages).includes(pageId)
	const isDynamic = siteConfig.dynamicPagesIds.includes(pageId) && !isTpa

	const pageData = {
		pagePath: parsedUrl.pathname.concat(parsedUrl.search),
		pageTitle,
		pageId,
		pageNumber,
		viewer: ViewerType.TB,
		pageType: isTpa ? PageType.TPA : isDynamic ? PageType.Dynamic : PageType.Static,
		pageApp: isTpa ? appPages[pageId].appDefId : isDynamic ? PageApp.Dynamic : PageApp.Editor,
		pageTypeIdentifier: isTpa ? appPages[pageId].tpaPageId : pageId,
	}

	reporterApi.trackEvent(
		{
			eventName: 'PageView',
			params: pageData,
			options: { reportToManagedChannels: true, context: { isFirstVisit: pageNumber === 1 } },
		},
		reporterOptions
	)
}
