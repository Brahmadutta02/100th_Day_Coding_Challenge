import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	IAppWillMountHandler,
	BrowserWindow,
	BrowserWindowSymbol,
	ViewerModelSym,
	ViewerModel,
	ILanguage,
	FeatureStateSymbol,
	LanguageSymbol,
	CurrentRouteInfoSymbol,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { SiteMembersApiSymbol, LoginOptions, ISiteMembersApi } from 'feature-site-members'
import { IFeatureState } from 'thunderbolt-feature-state'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import { LoginErrorDetails, WixEmbedsAPI, WixEmbedsAPISiteConfig, WixEmbedsAPIFeatureState } from './types'

import { ICurrentRouteInfo } from 'feature-router'

import { name } from './symbols'

const wixEmbedsApiSiteFactory = (
	config: WixEmbedsAPISiteConfig,
	featureState: IFeatureState<WixEmbedsAPIFeatureState>,
	sessionManager: ISessionManager,
	window: NonNullable<BrowserWindow>,
	viewerModel: ViewerModel,
	language: ILanguage,
	currentRouteInfo: ICurrentRouteInfo,
	siteMembersApi?: ISiteMembersApi
): IAppWillMountHandler => {
	return {
		async appWillMount() {
			const state: WixEmbedsAPIFeatureState = { listeners: {}, firstMount: true }
			featureState.update(() => state)

			const callbacksFor = (eventName: string) => state.listeners[eventName] || []
			const { site } = viewerModel
			const api: WixEmbedsAPI = {
				getMetaSiteId: () => site.metaSiteId,
				getHtmlSiteId: () => site.siteId,
				getExternalBaseUrl: () => site.externalBaseUrl,
				isWixSite: () => site.siteType === 'WixSite',
				getLanguage: () => language.siteLanguage,
				getCurrentPageInfo: () => {
					return {
						id: currentRouteInfo.getCurrentRouteInfo()?.pageId,
						type: config.isAdminPage ? 'admin' : 'site',
					}
				},

				getAppToken: (appDefId) => sessionManager.getAppInstanceByAppDefId(appDefId),

				registerToEvent(eventName, callback) {
					state.listeners[eventName] = callbacksFor(eventName)
					state.listeners[eventName].push(callback)
				},
				unregisterFromEvent(eventName, callback) {
					state.listeners[eventName] = [...callbacksFor(eventName)].filter((func) => func !== callback)
				},
				promptLogin({
					onSuccess = () => {},
					onError = () => {},
					modal,
					mode,
				}: Partial<LoginOptions> & { onSuccess: any; onError: any }) {
					if (siteMembersApi) {
						siteMembersApi.registerToUserLogin(async () => {
							const member = await siteMembersApi.getMemberDetails()
							onSuccess({
								member: {
									memberId: member?.id,
									isOwner: member?.owner,
									role: member?.role,
								},
							})
						})
						siteMembersApi.promptLogin({ modal, mode })
					} else {
						onError({ reason: LoginErrorDetails.missingMembersArea })
					}
				},
				getSkipToMainContentButtonSelector: () => '#SKIP_TO_CONTENT_BTN',
				getMainContentElementSelector: () => '#PAGES_CONTAINER',
			}

			window.wixEmbedsAPI = api
			const event = window.document.createEvent('Event')
			event.initEvent('wixEmbedsAPIReady', true, false)
			// since react umd bundles do not define named modules, we must load react before potentially loading requirejs.
			// further details here: https://requirejs.org/docs/errors.html#mismatch
			await window.reactAndReactDOMLoaded
			window.dispatchEvent(event)
		},
	}
}

export const WixEmbedsApiSite = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(FeatureStateSymbol, name),
		SessionManagerSymbol,
		BrowserWindowSymbol,
		ViewerModelSym,
		LanguageSymbol,
		CurrentRouteInfoSymbol,
		optional(SiteMembersApiSymbol),
	],
	wixEmbedsApiSiteFactory
)
