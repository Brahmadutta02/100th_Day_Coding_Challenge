import type { ViewerModel } from '@wix/thunderbolt-symbols'
import { LoginOptions } from 'feature-site-members'

type ViewerModelSite = ViewerModel['site']

export type WixEmbedsAPIFeatureState = {
	listeners: {
		[eventName: string]: Array<Function>
	}
	firstMount: boolean
}

export type WixEmbedsAPISiteConfig = {
	isAdminPage: boolean
}

export type PageType = 'site' | 'admin'

export type PageInfo = {
	id: string | undefined
	type: PageType
}

export interface WixEmbedsAPI {
	getMetaSiteId(): ViewerModelSite['metaSiteId']
	getHtmlSiteId(): ViewerModelSite['siteId']
	getExternalBaseUrl(): ViewerModelSite['externalBaseUrl']
	isWixSite(): boolean
	getLanguage(): ViewerModel['language']['siteLanguage']
	getCurrentPageInfo(): PageInfo

	getAppToken(appDefId: string): string | undefined

	registerToEvent(eventName: string, callback: Function): void
	unregisterFromEvent(eventName: string, callback: Function): void
	promptLogin(loginOptions: Partial<LoginOptions> & { onSuccess: () => {}; onError: () => {} }): void
	getSkipToMainContentButtonSelector(): string
	getMainContentElementSelector(): string
}

export enum LoginErrorDetails {
	'missingMembersArea' = 'Missing Memebers Area',
	'unknown' = 'Unknown',
}

declare global {
	interface Window {
		wixEmbedsAPI: WixEmbedsAPI
	}
}
