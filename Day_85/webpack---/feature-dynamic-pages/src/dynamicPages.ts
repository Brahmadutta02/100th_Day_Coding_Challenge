import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	DynamicPagesAPI,
	FetchParams,
	IRoutingMiddleware,
	IUrlHistoryManager,
	UrlHistoryManagerSymbol,
} from 'feature-router'
import { getCSRFToken } from '@wix/thunderbolt-commons'
import { BrowserWindow, BrowserWindowSymbol, Fetch, IFetchApi, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import type {
	DynamicPagesSiteConfig,
	IDynamicPagesResponseHandler,
	IPermissionsHandlerProvider,
	RouterFetchData,
} from './types'
import { DynamicPagesResponseHandlerSymbol, name, PermissionsHandlerProviderSymbol } from './symbols'
import { errorPagesIds, getRouterPrefix, getRouterSuffix } from './utils'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'

enum DynamicRequestTypes {
	PAGES = 'pages',
	SITEMAP = 'sitemap',
}

const addQueryParam = (url: string, paramName: string, paramValue: string): string => {
	const parsedUrl = new URL(url)
	parsedUrl.searchParams.append(paramName, paramValue)

	return parsedUrl.toString()
}

export const DynamicPages = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		SessionManagerSymbol,
		Fetch,
		UrlHistoryManagerSymbol,
		DynamicPagesResponseHandlerSymbol,
		PermissionsHandlerProviderSymbol,
		BrowserWindowSymbol,
		CommonConfigSymbol,
	],
	(
		{ prefixToRouterFetchData, routerPagesSeoToIdMap, externalBaseUrl, viewMode }: DynamicPagesSiteConfig,
		sessionManager: ISessionManager,
		fetchApi: IFetchApi,
		urlHistoryManager: IUrlHistoryManager,
		{ handleResponse }: IDynamicPagesResponseHandler,
		permissionsHandlerProvider: IPermissionsHandlerProvider,
		window: BrowserWindow,
		commonConfigAPI: ICommonConfig
	): IRoutingMiddleware & DynamicPagesAPI => {
		const getBody = (routerFetchData: RouterFetchData, relativeEncodedUrl: string, queryParams: string) => {
			const { routerPrefix, config, pageRoles, roleVariations } = routerFetchData.optionsData.bodyData
			const routerSuffix = getRouterSuffix(relativeEncodedUrl)
			const fullUrl = `${externalBaseUrl}${routerPrefix}${routerSuffix}${queryParams}`

			return JSON.stringify({
				routerPrefix,
				routerSuffix,
				fullUrl,
				config,
				pageRoles,
				roleVariations,
				requestInfo: {
					env: process.env.browser ? 'browser' : 'backend',
					formFactor: viewMode,
				},
			})
		}

		const getFetchParams = (
			routerFetchData: RouterFetchData,
			relativeEncodedUrl: string,
			extraQueryParams: string,
			requestType: DynamicRequestTypes
		): FetchParams => {
			const { basePath, queryParams, appDefinitionId } = routerFetchData.urlData
			const url = `${basePath}/${requestType}?${queryParams}`
			const instance = sessionManager.getAppInstanceByAppDefId(appDefinitionId) as string
			const urlWithInstance = addQueryParam(url, 'instance', instance)
			const authorizationHeader =
				routerFetchData.shouldAddWixCodeInstanceToHeader &&
				sessionManager.getAppInstanceByAppDefId(routerFetchData.wixCodeAppDefinitionId)
			if (authorizationHeader) {
				routerFetchData.optionsData.headers!['Authorization' as string] = authorizationHeader
			}
			if (process.env.browser) {
				routerFetchData.optionsData.headers!['X-XSRF-TOKEN' as string] = getCSRFToken(window?.document?.cookie)
			}

			return {
				url: urlWithInstance,
				options: {
					method: 'POST',
					body: getBody(routerFetchData, relativeEncodedUrl, extraQueryParams),
					headers: {
						...(process.env.PACKAGE_NAME === 'thunderbolt-ds'
							? {}
							: { commonConfig: JSON.stringify(commonConfigAPI.getCommonConfig()) }),
						...routerFetchData.optionsData.headers,
					},
					...(routerFetchData.optionsData.credentials
						? { credentials: routerFetchData.optionsData.credentials }
						: {}),
					...(routerFetchData.optionsData.mode ? { mode: routerFetchData.optionsData.mode } : {}),
				},
			}
		}

		return {
			getSitemapFetchParams(routerPrefix) {
				const routerFetchData = prefixToRouterFetchData[routerPrefix]
				if (!routerFetchData) {
					return null
				}

				return getFetchParams(
					routerFetchData,
					urlHistoryManager.getRelativeEncodedUrl(),
					urlHistoryManager.getParsedUrl().search,
					DynamicRequestTypes.SITEMAP
				)
			},
			async handle(routeInfo) {
				if (!routeInfo.pageId && routeInfo.relativeUrl && routeInfo.parsedUrl && routeInfo.relativeEncodedUrl) {
					const routerPrefix = getRouterPrefix(routeInfo.relativeUrl)
					const routerFetchData = prefixToRouterFetchData[routerPrefix]

					if (!routerFetchData) {
						if (routerPagesSeoToIdMap[routerPrefix]) {
							return {
								...routeInfo,
								pageId: errorPagesIds.NOT_FOUND,
							}
						}
						return routeInfo
					}

					const { url, options } = getFetchParams(
						routerFetchData,
						routeInfo.relativeEncodedUrl,
						routeInfo.parsedUrl.search,
						DynamicRequestTypes.PAGES
					)

					const routeInfoFromResponsePromise = handleResponse(fetchApi.envFetch(url, options), routeInfo)
					return permissionsHandlerProvider.getHandler().handle(routeInfoFromResponsePromise, routeInfo)
				}

				return routeInfo
			},
		}
	}
)
