import { named, withDependencies } from '@wix/thunderbolt-ioc'
import type { DynamicPagesSiteConfig, IDynamicPagesResponseHandler } from './types'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	DomReadySymbol,
	HeadContentSymbol,
	IHeadContent,
	SiteFeatureConfigSymbol,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { ISeoSiteApi, SeoSiteSymbol } from 'feature-seo'
import { name } from './symbols'
import { isSSR } from '@wix/thunderbolt-commons'
import {
	errorPagesIds,
	getErrorPageId,
	getRouterPrefix,
	getSuccessResponse,
	isExternalUrl,
	getRelativeUrl,
} from './utils'

const getAbsoluteUrl = (redirectUrl: string, baseUrl: string, routerPrefix: string, searchParams: string): string => {
	if (isExternalUrl(redirectUrl)) {
		return redirectUrl
	}

	const relativeUrl = getRelativeUrl(redirectUrl, routerPrefix)
	const absoluteUrl = new URL(relativeUrl, `${baseUrl}/`)
	absoluteUrl.search = searchParams

	return absoluteUrl.toString()
}

export const DynamicPagesResponseHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		HeadContentSymbol,
		SeoSiteSymbol,
		ExperimentsSymbol,
		DomReadySymbol,
	],
	(
		{ externalBaseUrl }: DynamicPagesSiteConfig,
		browserWindow: BrowserWindow,
		headContent: IHeadContent,
		seoApi: ISeoSiteApi,
		experiments: Experiments,
		domReadyPromise: Promise<void>
	): IDynamicPagesResponseHandler => {
		return {
			async handleResponse(routerResponse, routeInfo) {
				const routerPrefix = getRouterPrefix(routeInfo.relativeUrl!)

				return routerResponse
					.then(async (response: Response) => {
						if (!response.ok) {
							throw response
						}
						const data = await response.json()
						const { result, exception } = data
						const { redirectUrl, status } = result

						if (status && isSSR(browserWindow) && seoApi.isInSEO()) {
							seoApi.setVeloSeoStatusCode(status)
						}

						if (redirectUrl) {
							if (isSSR(browserWindow)) {
								const absoluteRedirectUrl = getAbsoluteUrl(
									redirectUrl,
									externalBaseUrl,
									routerPrefix,
									routeInfo.parsedUrl!.search
								)

								seoApi.setRedirectUrl(absoluteRedirectUrl)

								return null
							}

							await domReadyPromise!
							if (browserWindow.document.head.querySelector('meta[http-equiv="refresh"]')) {
								return null
							}

							if (isExternalUrl(redirectUrl)) {
								browserWindow.location.assign(redirectUrl)
								return null
							}

							const relativeUrl = getRelativeUrl(redirectUrl, routerPrefix)
							return {
								redirectUrl: relativeUrl,
							}
						}

						const errorPageId = getErrorPageId(result, exception)

						return errorPageId
							? {
									...routeInfo,
									pageId: errorPageId,
							  }
							: getSuccessResponse(routeInfo, data)
					})
					.catch(() => {
						if (isSSR(browserWindow)) {
							return null
						}

						return {
							...routeInfo,
							pageId: errorPagesIds.INTERNAL_ERROR,
						}
					})
			},
		}
	}
)
