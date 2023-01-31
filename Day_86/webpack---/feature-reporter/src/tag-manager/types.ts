export enum SUPPORTED_CHANNELS {
	FACEBOOK_PIXEL = 'facebookPixel',
	GOOGLE_ANALYTICS = 'googleAnalytics',
	GOOGLE_TAG_MANAGER = 'googleTagManager',
	WIX_ANALYTICS = 'wixAnalytics',
	BI_ANALYTICS = 'biAnalytics',
	GTAG = 'gtag',
	VK_RETARGETING = 'vkRetargeting',
	YANDEX_METRICA = 'yandexMetrica',
	WIX_DEVELOPERS_ANALYTICS = 'wix-developers-analytics',
}

export enum Event {
	TagManagerLoaded = 'TagManagerLoaded',
	LoadingTags = 'LoadingTags',
	TagLoaded = 'TagLoaded',
	TagLoadError = 'TagLoadError',
}

export enum LoadStatus {
	Error = 'error',
	Success = 'success',
}

export type SiteTag = {
	id?: string
	name?: string
	content?: string
	config?: { [key: string]: any }
	position?: GeolocationPosition
	loadOnce?: boolean
	domain?: string
	category?: string
}

export type LoadedScripts = { [key: string]: SiteTag }

export type OnTagManagerReady = (channels: Function) => void

export type LoadingTagsEventHandler = (event: CustomEvent, setLoadedScripts: Function) => void

export type TagLoadedEventHandler = (event: CustomEvent, setTagLoaded: Function, loadStatus: LoadStatus) => void
