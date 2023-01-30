import type { Hub } from '@wix/fe-essentials-viewer-platform/sentry/types'
import type { Factory } from '@wix/fe-essentials-viewer-platform/bi'
import type { PhasesConfig } from '@wix/fe-essentials-viewer-platform/fedops'
import type { FetchFn, ViewerModel } from '../../types'

export type NumericBoolean = 0 | 1 | -999 // -999 is a placeholder for not-supported data

export enum BeatEventType {
	START = 1,
	VISIBLE = 2,
	PAGE_FINISH = 33,
	FIRST_CDN_RESPONSE = 4,
	TBD = -1,
	PAGE_NAVIGATION = 101,
	PAGE_NAVIGATION_DONE = 103,
}

export enum InternalNavigationType { // this param is sent with navigation-end beat (103)
	NAVIGATION = 1, // successful navigation
	DYNAMIC_REDIRECT = 2, // redirect finished
	INNER_ROUTE = 3, // inner route finish
	NAVIGATION_ERROR = 4, // for protected page | dynamic route errors
	CANCELED = 5, // unnecessary navigation canceled
}

export const NavigationLoggerStringMap = {
	// map between InternalNavigationType to fed ops logger string
	1: 'page-navigation', // successful navigation
	2: 'page-navigation-redirect', // redirect finished
	3: 'page-navigation-inner-route', // inner route finish
	4: 'navigation-error', // for protected page | dynamic route errors
	5: 'navigation-canceled', // unnecessary navigation canceled
}

export type ReportBI = (eventName: string, eventPhase?: string) => void
export type SendBeat = (
	eventType: BeatEventType,
	eventName: string,
	options?: { pageId?: string; pageNumber?: number; navigationType?: InternalNavigationType }
) => void

export type ReportPageNavigation = (pageId: string | undefined) => void

export type ReportPageNavigationDone = (pageId: string | undefined, navigationType: InternalNavigationType) => void

type WixBiSessionBase = {
	initialTimestamp: number
	initialRequestTimestamp: number
	viewerSessionId: string
	sessionId: string
	msId: string
	is_rollout: 0 | 1 | null
	is_platform_loaded: NumericBoolean
	suppressbi: boolean
	dc: string
	requestUrl: string
	siteRevision: string
	siteCacheRevision: string
	checkVisibility: () => boolean
	isMesh: NumericBoolean
	isServerSide?: NumericBoolean
	fallbackReason?: string
	viewerName: 'thunderbolt' | 'thunderbolt-responsive'
	st: 0 | 1 | 2 | 3
	btype: string
	isjp: boolean
	commonConfig: ViewerModel['commonConfig']
	muteThunderboltEvents: boolean
}

export type CookieAnalysis = { isCached: boolean; caching: string; microPop?: string }

export type WixBiSession = WixBiSessionBase & CookieAnalysis

export type BiStore = {
	frogUrlOverride?: string
	checkVisibility?: () => boolean
	msid: WixBiSession['msId']
	initialTimestamp: WixBiSession['initialTimestamp']
	initialRequestTimestamp: WixBiSession['initialRequestTimestamp']
	requestUrl?: WixBiSession['requestUrl']
	st?: WixBiSession['st']
	viewerSessionId: WixBiSession['viewerSessionId']
	dc: WixBiSession['dc']
	microPop?: string
	is_rollout: WixBiSession['is_rollout']
	isCached: WixBiSession['isCached']
	caching?: CookieAnalysis['caching']
	is_headless: boolean
	is_headless_reason?: string
	viewerVersion: string
	rolloutData: ViewerModel['rollout']
	session_id?: string
	pageData: { pageNumber: number; pageId: string; pageUrl: string; isLightbox: boolean }
}

export type FedopsStore = {
	msid: string
	sessionId: string
	viewerSessionId: string
	dc: string
	is_rollout: boolean | null
	is_dac_rollout?: number
	is_sav_rollout?: number
	isCached: boolean | null
	is_headless: boolean
	siteMemberId?: string
}

export type FedopsConfig = {
	biLoggerFactory: Factory
	customParams?: { [paramName: string]: string | boolean }
	paramsOverrides?: { [paramName: string]: any }
	phasesConfig?: PhasesConfig
	presetType?: string
	appName?: string
	reportBlackbox?: boolean
	muteThunderboltEvents?: boolean
}

export type LoggerIntegrations = {
	sentry: Hub
	wixBiSession: WixBiSession
	viewerModel: ViewerModel
	fetch: FetchFn
	ssrInitialEvents?: Array<{ name: string; startTime: number }>
	onReport?: (message: string, params?: Record<any, any>) => void
}

export type MuteFunc = () => boolean
