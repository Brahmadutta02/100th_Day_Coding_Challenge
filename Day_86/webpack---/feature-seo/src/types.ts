import type { HtmlServerSeoPattern, LanguageLink } from '@wix/thunderbolt-ssr-api'
import type { IMultilingual, SeoTagsPayload, SetVeloSeoTags, ResetVeloSeoTags } from '@wix/thunderbolt-symbols'
import type { RouteInfo } from 'feature-router'

export { SeoTagsPayload }

export interface ISeoSiteApi {
	getPageTitle(): Promise<string>
	getSeoStatusCode(): number
	getRedirectUrl(): string | undefined
	getSiteLevelSeoData(): SiteLevelSeoData
	isInSEO(): boolean
	onTPAOverridesChanged(cb: (payload: Array<any>) => void): () => void
	renderSEO(): Promise<void>
	renderSEODom(): Promise<void>
	resetVeloSeoTags: ResetVeloSeoTags
	setVeloSeoTags: SetVeloSeoTags
	resetTpaAndVeloData(): void
	resetTPAEndpointData(): void
	setVeloLinks(links: Array<any>): Promise<void>
	setVeloMetaTags(metaTags: Array<MetaTag>): Promise<void>
	setVeloSeoStatusCode(seoStatusCode: number): void
	setRedirectUrl(redirectUrl: string): void
	setVeloStructuredData(structuredData: Array<Record<string, any>>): Promise<void>
	setVeloTitle(title: string): Promise<void>
	setDynamicRouteOverrides(payload: RouteInfo['dynamicRouteData'] | undefined): Promise<void>
	setPageId(pageId?: string): void
	setPageData(pageData?: SeoPageConfig): void
	setPageHref(href?: string): void
	setTPAEndpointData(payload?: SeoTPAPayload): Promise<void>
	setTPAOverrides(payload: SeoTPAPayload): Promise<void>
}

export type SeoPageConfig = {
	description: string
	indexPage: boolean
	ogImage: string
	ogImageHeight: number
	ogImageWidth: number
	pageName: string
	title: string
	advancedSeoData: string
	pageId: string
	currentPageUrl?: string
	translationsData: any
	tpaPageId: string
	managingAppDefId: string
	// TODO: Remove once the experiment is merged
	forceNoIndexForMemberPages: boolean
}

export interface SeoContextProps {
	siteName?: string
	siteUrl?: string
	siteOgImage?: string
	homePageTitle?: string
	ogTitle?: string
	ogType?: string
	ogDescription?: string
	defaultUrl?: string
	indexSite?: boolean
	robotsFromUserPatterns?: string
	prevLink?: string
	nextLink?: string
	facebookAdminId?: string
	currLangCode?: string
	seoLang?: string
	currLangIsOriginal?: boolean
	currLangResolutionMethod?: IMultilingual['currentLanguage']['resolutionMethod']
	businessName?: string
	businessLocationCountry?: string
	businesLocationsState?: string
	businessLocationCity?: string
	businesLocationsStreet?: string
	businesLocationsDescription?: string
	businesDescription?: string
	businesLogo?: string
	businesLocale?: string
	siteLanguages?: IMultilingual['siteLanguages'] | Array<LanguageLink>
}

export interface SiteLevelSeoData {
	context: SeoContextProps
	userPatterns: Array<HtmlServerSeoPattern>
	metaTags: Array<MetaTag>
	customHeadTags: string
	isInSEO: boolean
	hasBlogAmp: boolean
	mainPageId: string
}
export type SeoTPAPayload = {
	title?: string
	fullTitle?: string
	description?: string
}

export type MetaTag = {
	name: string
	property: string
	content: string
}

export type App = {
	appDefinitionName: string
	appDefinitionId: string
}

export type SeoDynamicRouteData = {
	veloOverrides?: Array<any>
	dynamicPageData?: Array<any>
}
export type SeoSiteState = {
	pageId: string | undefined
	pageLevelData?: SeoPageConfig
	pageHref: string
	tpaSeoEndpointData: Array<any>
	tpaOverrides: Array<any>
	veloOverrides: Array<any>
	veloItemPayload: SeoTagsPayload | undefined
	seoStatusCode: number
	redirectUrl: string | undefined
	dynamicPageData: Array<any>
	tpaOverridesListener: (tpaOverrides: Array<any>) => void
	componentsItemPayload: Array<SeoTagsPayload>
}

export type SeoMasterPageConfig = {
	[key: string]: {
		title: string
		managingAppDefId: string
		tpaPageId: string
		pageUriSEO: string
	}
}

export type SeoFeatureState = {
	isPageMounted: boolean
	isAfterNavigation: boolean
}

export enum OgTags {
	OG_TITLE = 'og:title',
	OG_DESCRIPTION = 'og:description',
	OG_IMAGE = 'og:image',
	OG_IMAGE_WIDTH = 'og:image:width',
	OG_IMAGE_HEIGHT = 'og:image:height',
	OG_URL = 'og:url',
}

export enum TwitterTags {
	TWITTER_TITLE = 'twitter:title',
	TWITTER_CARD = 'twitter:card',
	TWITTER_DESCRIPTION = 'twitter:description',
	TWITTER_IMAGE = 'twitter:image',
}

export type AttributeDescriptor = 'name' | 'property' | 'rel' | 'href' | 'content'

export type TagAttribute = {
	key: AttributeDescriptor
	value: string
}

export type SeoElement = {
	type: 'link' | 'meta'
	name: TagAttribute
	content: TagAttribute
}

export type LogErrorPayload = {
	error: any
	data: any
}
export type MethodOptions = {
	logError: (logErrorPayload: LogErrorPayload) => void
}
