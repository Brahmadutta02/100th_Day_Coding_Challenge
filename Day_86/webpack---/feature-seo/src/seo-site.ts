import _ from 'lodash'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	HeadContentSymbol,
	IHeadContent,
	SiteFeatureConfigSymbol,
	HeadContentType,
	IMultilingual,
	MasterPageFeatureConfigSymbol,
	FeatureStateSymbol,
	Language,
	LoggerSymbol,
	ILogger,
	SsrLoggerSymbol,
	FeatureExportsSymbol,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { MultilingualSymbol } from 'feature-multilingual'
import type {
	SiteLevelSeoData,
	ISeoSiteApi,
	SeoSiteState,
	SeoMasterPageConfig,
	SeoFeatureState,
	SeoPageConfig,
} from './types'
import { name } from './symbols'
import { DEFAULT_STATUS_CODE } from './api'
import { TbDebugSymbol, ISeoDebugHandlers } from 'feature-debug'
import { IFeatureState } from 'thunderbolt-feature-state'
import { Logger } from '@wix/thunderbolt-ssr-api'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'

const initialFeatureState: SeoFeatureState = {
	isPageMounted: false,
	isAfterNavigation: false,
}

const shouldRenderDom = (featureState: IFeatureState<SeoFeatureState>): boolean => {
	const { isPageMounted, isAfterNavigation } = featureState.get() || initialFeatureState
	const isInSSR = !process.env.browser
	const isClientFallback = !isInSSR && window.clientSideRender
	const noTitleExistsOnClient = !isInSSR && !document?.title?.length && !!document?.body
	const isClientReady = !isInSSR && isPageMounted && isAfterNavigation
	return isClientReady || isClientFallback || noTitleExistsOnClient
}

export const SeoSite = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		HeadContentSymbol,
		named(FeatureStateSymbol, name),
		LoggerSymbol,
		ExperimentsSymbol,
		optional(MultilingualSymbol),
		optional(TbDebugSymbol),
		optional(SsrLoggerSymbol),
		named(FeatureExportsSymbol, name),
	],
	(
		siteLevelSeoData: SiteLevelSeoData,
		masterPageConfig: SeoMasterPageConfig,
		headUtils: IHeadContent,
		featureState: IFeatureState<SeoFeatureState>,
		logger: ILogger,
		experiments: Experiments,
		multilingualApi: IMultilingual | undefined,
		tbDebug: ISeoDebugHandlers | undefined,
		tbLogger: Logger | undefined,
		seoExports: IFeatureExportsStore<typeof name>
	): ISeoSiteApi => {
		const state: SeoSiteState = {
			pageId: undefined,
			pageLevelData: undefined,
			tpaSeoEndpointData: [],
			tpaOverrides: [],
			veloOverrides: [],
			veloItemPayload: undefined,
			seoStatusCode: DEFAULT_STATUS_CODE,
			redirectUrl: undefined,
			dynamicPageData: [],
			tpaOverridesListener: _.noop,
			pageHref: siteLevelSeoData.context.defaultUrl,
			componentsItemPayload: [],
		} as SeoSiteState

		const logError = ({ error, data }: { error: any; data: any }) => {
			logger.captureError(error, { tags: { feature: 'seo-site' }, extra: data })
			if (tbDebug) {
				tbDebug.seoLogError('SEO Error', { error })
				tbLogger?.error('SEO|Error', { error })
			}
		}
		const logInfo = tbDebug
			? (message: string, params?: Record<any, any>) => {
					tbDebug.seoLogInfo(message, params)
					tbLogger?.info(`SEO|Info|${message}`, params)
			  }
			: undefined

		if (multilingualApi) {
			siteLevelSeoData.context.currLangCode = multilingualApi.currentLanguage.languageCode
			siteLevelSeoData.context.seoLang = multilingualApi.currentLanguage.seoLang
			siteLevelSeoData.context.currLangResolutionMethod = multilingualApi.currentLanguage.resolutionMethod
			siteLevelSeoData.context.currLangIsOriginal = multilingualApi.isOriginalLanguage
			siteLevelSeoData.context.siteLanguages = getSiteLanguages(multilingualApi.siteLanguages)
		}

		const getPageData = (pageId = ''): Partial<SeoPageConfig> => {
			return {
				...(masterPageConfig[pageId] || {}),
				...(state.pageLevelData || {}),
				currentPageUrl: state.pageHref,
			}
		}

		function getSiteLanguages(siteLanguages: Array<Language>) {
			const primary = siteLanguages.find((lang) => lang.isPrimaryLanguage)
			if (primary) {
				const xDefault: Language = {
					...primary,
					isPrimaryLanguage: false,
					languageCode: 'x-default',
				}

				return [xDefault, ...siteLanguages]
			} else {
				return siteLanguages
			}
		}

		const getInstalledApps = () => {
			return Object.values(masterPageConfig)
		}

		const getTagsPayload = () => ({
			siteLevelSeoData: {
				...siteLevelSeoData,
				context: {
					...siteLevelSeoData.context,
					defaultUrl: state.pageHref,
					installedApps: getInstalledApps(),
				},
			},
			pageLevelSeoData: getPageData(state.pageId),
			veloOverrides: state.veloOverrides,
			veloItemPayload: state.veloItemPayload,
			tpaSeoEndpointData: state.tpaSeoEndpointData,
			tpaOverrides: state.tpaOverrides,
			dynamicPageData: state.dynamicPageData,
			componentsItemPayload: state.componentsItemPayload,
			options: { logError, logInfo },
		})

		const renderSEODom = async () => {
			if (shouldRenderDom(featureState)) {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				const tags = await api.getTags(getTagsPayload())
				const title = api.getTitle(tags)
				api.setWindowTitle(title)
				api.setSocialTagsToDOM(tags)
			}
		}

		const renderSEO: ISeoSiteApi['renderSEO'] = async () => {
			if (process.env.browser) {
				await window.externalsRegistry.react.loaded // seo api assume React is loaded so we need to wait for it here
			}
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			const tags = await api.getTags(getTagsPayload())
			const staticMarkup = api.getStaticMarkup(tags, { logError }).concat(siteLevelSeoData.customHeadTags)
			headUtils.setHead(staticMarkup, HeadContentType.SEO)
			renderSEODom()
			return tags
		}

		const setVeloSeoTags: ISeoSiteApi['setVeloSeoTags'] = async (payload) => {
			if (payload?.itemType && payload?.itemData) {
				const { isComponentItemType } = await import('./api/api' /* webpackChunkName: "seo-api" */)

				if (isComponentItemType(payload.itemType)) {
					state.componentsItemPayload.push(payload)
				} else {
					state.veloItemPayload = {
						asNewPage: false,
						seoData: {},
						...payload,
					}
				}
			}
			renderSEO()
		}

		const resetVeloSeoTags: ISeoSiteApi['resetVeloSeoTags'] = async () => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.veloItemPayload = api.getDefaultItemPayload()
			state.componentsItemPayload = []
			renderSEO()
		}

		seoExports.export({ setVeloSeoTags, resetVeloSeoTags })

		const seoApi: ISeoSiteApi = {
			getSiteLevelSeoData: (): SiteLevelSeoData => siteLevelSeoData,
			getSeoStatusCode: (): number => state.seoStatusCode,
			getRedirectUrl: () => state.redirectUrl,
			setPageId: (pageId) => {
				state.pageId = pageId
			},
			setPageData: (pageLevelSeoData) => {
				state.pageLevelData = pageLevelSeoData
			},
			setPageHref: (href) => {
				if (href) {
					state.pageHref = href
				}
			},
			resetTpaAndVeloData: () => {
				state.tpaOverrides = []
				state.dynamicPageData = []
				state.veloOverrides = []
				state.veloItemPayload = undefined
				state.tpaOverridesListener(state.tpaOverrides)
			},
			setVeloTitle: async (title) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				state.veloOverrides = api.setTitle(state.veloOverrides, title)
				renderSEO()
			},
			setVeloLinks: async (links) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				state.veloOverrides = api.setLinks(state.veloOverrides, links)
				renderSEO()
			},
			setVeloMetaTags: async (metaTags) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				state.veloOverrides = api.setMetaTags(state.veloOverrides, metaTags)
				renderSEO()
			},
			setVeloStructuredData: async (structuredData) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				state.veloOverrides = api.setSchemas(state.veloOverrides, structuredData)
				renderSEO()
			},
			setVeloSeoStatusCode: (seoStatusCode) => {
				state.seoStatusCode = seoStatusCode
			},
			setRedirectUrl: (redirectUrl) => {
				state.redirectUrl = redirectUrl
			},
			setVeloSeoTags,
			resetVeloSeoTags,
			renderSEO,
			renderSEODom,
			isInSEO: () => siteLevelSeoData.isInSEO,
			getPageTitle: async () => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				const tags = await api.getTags(getTagsPayload())
				const title = api.getTitle(tags)
				return title
			},
			setTPAOverrides: async (payload) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				const { title, fullTitle, description } = payload
				if (fullTitle) {
					state.tpaOverrides = api.setTitle(state.tpaOverrides, fullTitle)
				} else if (title) {
					state.tpaOverrides = api.setTitle(state.tpaOverrides, title)
				}
				if (description) {
					state.tpaOverrides = api.setDescription(state.tpaOverrides, description)
				}
				state.tpaOverridesListener(state.tpaOverrides)
			},
			setTPAEndpointData: async (payload) => {
				const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
				state.tpaSeoEndpointData = await api.convertTPAEndpointModel(payload)
			},
			resetTPAEndpointData: () => {
				state.tpaSeoEndpointData = []
			},
			setDynamicRouteOverrides: async (payload) => {
				if (payload) {
					const { mediaItemUtils } = await import(
						'@wix/santa-platform-utils' /* webpackChunkName: "santa-platform-utils" */
					)
					const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
					const { veloOverrides = state.veloOverrides, dynamicPageData = state.dynamicPageData } =
						api.extractDynamicRouteData(payload, mediaItemUtils, state.veloOverrides) || {}
					state.veloOverrides = veloOverrides
					state.dynamicPageData = dynamicPageData
					if (
						experiments['specs.thunderbolt.ignorePageLevelIndexableForDynamicPages'] &&
						state?.pageLevelData
					) {
						state.pageLevelData.indexPage = true // fixes issue with dynamic pages not being indexed after converting static pages with noindex value that cannot be modified by users
					}
				}
			},
			onTPAOverridesChanged: (cb) => {
				state.tpaOverridesListener = cb
				return () => {
					state.tpaOverridesListener = _.noop
				}
			},
		}

		if (tbDebug) {
			const omit = (prop: any, { [prop]: __, ...rest }) => rest
			const getSeoState = () => omit('tpaOverridesListener', state)
			return tbDebug.seoDebugProxy(seoApi, getSeoState, getTagsPayload) as ISeoSiteApi
		}
		return seoApi
	}
)
