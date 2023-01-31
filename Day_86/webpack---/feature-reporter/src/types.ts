import type {
	IAppWillMountHandler,
	WixBiSession,
	BusinessLogger,
	ReporterEvent,
	IReporterApi,
	Experiments,
} from '@wix/thunderbolt-symbols'

import type { IConsentPolicy } from 'feature-consent-policy'
import type { IUrlHistoryManager } from 'feature-router'
import type { IFeatureState } from 'thunderbolt-feature-state'

export type ReporterSiteConfig = {
	userId: string
	metaSiteId: string
	isPremium: boolean
	isFBServerEventsAppProvisioned: boolean
	dynamicPagesIds: Array<string>
}

export type ReporterMasterPageConfig = {
	appPages: {
		[pageIds: string]: {
			appDefId: string
			tpaPageId: string
		}
	}
}

export { ReporterEvent, IReporterApi }

export interface ReporterState {
	pageNumber: number
	pageUrl: URL
	pageId: string
	sendDeferredPageView: () => void
	tagManagerReady: boolean
}

export type IReporterInit = (
	featureState: IFeatureState<ReporterState>,
	siteConfig: ReporterSiteConfig,
	wixBiSession: WixBiSession,
	businessLogger: BusinessLogger,
	experiments: Experiments,
	consentPolicy: IConsentPolicy,
	urlHistoryManager: IUrlHistoryManager
) => IAppWillMountHandler

declare global {
	interface Window {
		promoteAnalyticsChannels?: Array<any>
		fbq?: Function
		ga?: Function
		dataLayer?: Array<any>
		ym?: { hit: Function }
	}
}

export enum PiiParams {
	buyerMail = 'buyerMail',
	buyerId = 'buyerId',
}

export enum ViewerType {
	TB = 'TB',
}

export enum PageType {
	Static = 'static',
	TPA = 'TPA',
	Dynamic = 'dynamic',
}

export enum PageApp {
	Editor = 'editor',
	Dynamic = 'dynamic',
}

export enum UtmKeys {
	utmCampaign = 'utm_campaign',
	utmMedium = 'utm_medium',
	utmSource = 'utm_source',
	platform = 'platform',
	placement = 'placement',
}

export type UtmParams = Partial<Record<UtmKeys, string>>

export interface UtmLocalStorageItem {
	date: string
	[UtmKeys.utmCampaign]?: string
	[UtmKeys.utmMedium]?: string
	[UtmKeys.utmSource]?: string
	[UtmKeys.platform]?: string
	[UtmKeys.placement]?: string
}

export interface BiUtmParams {
	utmParams: Array<UtmLocalStorageItem>
	isTrimmed: boolean
}
