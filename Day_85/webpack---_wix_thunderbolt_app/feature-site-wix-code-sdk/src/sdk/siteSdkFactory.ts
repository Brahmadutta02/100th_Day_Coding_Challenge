import _ from 'lodash'
import {
	AppPrefixData,
	NotifyApplicationRequestCallback,
	OnInstanceChangedCallback,
	PageData,
	SiteWixCodeSdkFactoryData,
	SiteWixCodeSdkPageConfig,
	SiteWixCodeSdkWixCodeApi,
	StructurePageData,
	WixCodeApiFactoryArgs,
} from '@wix/thunderbolt-symbols'
import { logSdkError } from '@wix/thunderbolt-commons'
import { namespace } from '..'
import { SiteWixCodeSdkEditorHandlers, SiteWixCodeSdkHandlers } from '../types'

const pagesType = {
	STATIC_PAGE_TYPE: 'static',
	TEMPLATE_PAGE_TYPE: 'template',
}

export function SiteSdkFactory({
	featureConfig,
	handlers,
	platformEnvData,
	platformUtils: { sessionService, appsPublicApisUtils, clientSpecMapApi, locationManager },
	appDefinitionId: sdkInstanceAppDefinitionId,
}: WixCodeApiFactoryArgs<
	SiteWixCodeSdkFactoryData,
	SiteWixCodeSdkPageConfig,
	SiteWixCodeSdkHandlers & SiteWixCodeSdkEditorHandlers
>): {
	[namespace]: SiteWixCodeSdkWixCodeApi
} {
	const {
		regionalSettings,
		siteDisplayName,
		siteRevision,
		language,
		pagesData,
		nonPopupsPagesData,
		lightboxes,
		mainPageId,
		appsData,
		pageIdToPrefix,
		routerPrefixes,
		timezone,
		currency,
		urlMappings,
	} = featureConfig

	const baseUrl = locationManager.getBaseUrl()

	const { isLightbox, pageId: currentPageId } = platformEnvData.bi.pageData

	const pageIdToAppDefId = _.reduce(
		nonPopupsPagesData,
		(result: { [key: string]: string }, pageData) => {
			const appId = pageData.tpaApplicationId

			if (platformEnvData.site.experiments['specs.thunderbolt.readAppDefIdFromPageData'] && appId) {
				result[pageData.id] = pageData.appDefinitionId ?? appsData[appId]?.appDefinitionId
			} else {
				// Bug fix for PLAT-829
				if (appId && appsData[appId]) {
					result[pageData.id] = appsData[appId].appDefinitionId
				}
			}
			return result
		},
		{}
	)

	const appPrefixes = _.mapValues(
		pageIdToAppDefId,
		(appDefinitionId, pageId): AppPrefixData => {
			const pageData = pagesData[pageId]
			return {
				name: pageData.title,
				type: 'app',
				prefix: `/${pageData.pageUriSEO}`,
				applicationId: appDefinitionId,
			}
		}
	)

	const pages: Array<PageData> = _.map(nonPopupsPagesData, (pageData) => {
		const id = pageData.id
		const prefix = pageIdToPrefix[id]
		return {
			id,
			name: pageData.title,
			url: `/${pageData.pageUriSEO}`,
			type: prefix || pageIdToAppDefId[id] ? pagesType.TEMPLATE_PAGE_TYPE : pagesType.STATIC_PAGE_TYPE,
			..._.omitBy(
				{
					isHomePage: mainPageId === id,
					prefix,
					applicationId: pageIdToAppDefId[id],
					tpaPageId: pageData.tpaPageId,
				},
				(val) => _.isUndefined(val) || val === false
			),
		}
	})
	const structurePagesData: Array<StructurePageData> = _.map(pages, (page) => _.omit(page, 'tpaPageId'))

	const getSectionUrl = (
		sectionIdentifier: {
			sectionId: string
			appDefinitionId: string
		},
		useDefault: boolean = true
	): { relativeUrl: string; url: string } => {
		const sectionId = _.get(sectionIdentifier, 'sectionId')
		const appDefinitionId = _.get(sectionIdentifier, 'appDefinitionId')
		if (!sectionId || !appDefinitionId) {
			throw new Error(`getSectionUrl, invalid input. sectionId: ${sectionId} appDefinitionId: ${appDefinitionId}`)
		}

		const appPages = _.filter(pages, { applicationId: appDefinitionId })
		let page = _.find(appPages, { tpaPageId: sectionId })
		if (!page && useDefault) {
			page = appPages[0]
		}

		if (!page) {
			return { url: '', relativeUrl: '' }
		}

		const prefix = pageIdToPrefix[page.id]
		const relativeUrl = prefix ? `/${prefix}${page.url}` : page.url
		return { url: `${baseUrl}${relativeUrl}`, relativeUrl }
	}

	const removeIdField = <T extends object>(items: Array<T>): Array<Omit<T, 'id'>> =>
		items.map((item: T) => _.omit(item, ['id']) as Omit<T, 'id'>)

	const cleanPrefixesFromSiteMap = (siteMapEntries: Array<any>, prefix: string): Array<any> => {
		// eslint-disable-next-line no-useless-escape
		const reg = new RegExp(`.*?\/${prefix}`)
		return siteMapEntries.map((entry: any) => {
			if (entry && entry.url) {
				entry.url = entry.url.replace(reg, '')
				if (entry.url.charAt(0) === '/' && entry.url.length > 1) {
					entry.url = entry.url.substring(1)
				}
			}
			return entry
		})
	}
	return {
		[namespace]: {
			revision: `${siteRevision || 1}`, // TODO: implement siteRevision for dm flow
			regionalSettings,
			language,
			getAppToken: (appDefinitionId) => {
				const isRunningInDifferentSiteContext = platformEnvData.isRunningInDifferentSiteContext
				if (!clientSpecMapApi.isAppOnSite(appDefinitionId) && !isRunningInDifferentSiteContext) {
					logSdkError(`App with appDefinitionId ${appDefinitionId} does not exist on the site`)
					return null
				}

				// security - don't allow 3rd party code to get instances of other apps
				return clientSpecMapApi.isWixTPA(sdkInstanceAppDefinitionId)
					? sessionService.getInstance(appDefinitionId)
					: sessionService.getInstance(sdkInstanceAppDefinitionId)
			},
			getSiteStructure: (options) => {
				const includePageId = options?.includePageId
				const prefixes = [..._.values(appPrefixes), ..._.values(routerPrefixes)]
				return {
					lightboxes: includePageId ? lightboxes : removeIdField(lightboxes),
					pages: includePageId ? structurePagesData : removeIdField(structurePagesData),
					prefixes,
				}
			},
			getSectionUrl,
			loadNewSession: () => sessionService.loadNewSession(),
			onInstanceChanged: (callback: OnInstanceChangedCallback, appDefinitionId: string) => {
				if (!appDefinitionId) {
					logSdkError(`Missing appDefinitionId in onInstanceChanged`)
				}
				sessionService.onInstanceChanged(callback, appDefinitionId)
			},
			isAppSectionInstalled: (sectionIdentifier) => {
				const { url, relativeUrl } = getSectionUrl(sectionIdentifier, false)
				return !(url === '' && relativeUrl === '')
			},
			get currentPage() {
				if (isLightbox) {
					const lightbox = pagesData[currentPageId]
					return { name: lightbox.title, type: 'lightbox' as const }
				}

				return _.find(structurePagesData, { id: currentPageId })!
			},
			timezone,
			currency,
			getPublicAPI: appsPublicApisUtils.getPublicAPI,
			getCustomizedUrlSegments: async (url, options) => {
				const { getCustomizedUrlSegments } = await import(
					'@wix/url-mapper-utils' /* webpackChunkName: "url-mapper-utils" */
				)
				return getCustomizedUrlSegments(urlMappings, url, { baseUrl, ...options })
			},
			getSiteDisplayName() {
				return siteDisplayName
			},
			routerSitemap: async (routerPrefix) => {
				const fetchParams = await handlers.getSitemapFetchParams(routerPrefix)

				if (!fetchParams) {
					return Promise.reject('no such route')
				}

				const { url, options } = fetchParams
				const response = await fetch(url, options)
				if (!response.ok) {
					throw response
				}

				const { result } = await response.json()
				return cleanPrefixesFromSiteMap(result, routerPrefix)
			},
			prefetchPageResources: () => ({ message: 'success' }),
			notifyEventToEditorApp: handlers.notifyEventToEditorApp as NotifyApplicationRequestCallback,
		},
	}
}
