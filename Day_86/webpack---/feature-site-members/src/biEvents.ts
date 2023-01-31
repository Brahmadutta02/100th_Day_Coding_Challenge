import { BusinessLogger } from 'feature-business-logger'
import { ISessionManager } from 'feature-session-manager'
import { WixBiSession, ILanguage } from '@wix/thunderbolt-symbols'
import type { ViewModeProp } from './types'

export const BIEvents = ({
	sessionManager,
	businessLogger,
	wixBiSession,
	viewMode,
	language,
}: {
	sessionManager: ISessionManager
	businessLogger: BusinessLogger
	wixBiSession: WixBiSession
	viewMode: ViewModeProp
	language: ILanguage
}) => {
	const generateParams = (context?: string, layout?: string) => ({
		biToken: wixBiSession.msId,
		context,
		ts: getCurrentTimeStamp(wixBiSession),
		viewmode: viewMode,
		visitor_id: sessionManager.getVisitorId(),
		site_member_id: sessionManager.getSiteMemberId(),
		vsi: wixBiSession.viewerSessionId,
		site_settings_lng: language.siteLanguage,
		browser_lng: language.userLanguage,
		lng_mismatch: language.siteLanguage !== language.userLanguage,
		layout,
	})
	return {
		loginOrSignUpDialogLoaded: (context: string, layout = 'fullscreen') => {
			businessLogger.logger.log(
				{
					src: 5,
					evid: 658,
					...generateParams(context, layout),
				},
				{ endpoint: 'site-members' }
			)
		},
		closingDialog: (context: string, layout = 'fullscreen') => {
			businessLogger.logger.log(
				{
					src: 5,
					evid: 602,
					form_type: 'default',
					...generateParams(context, layout),
				},
				{ endpoint: 'site-members' }
			)
		},
		emailAuthSubmitClicked: (context: string, layout: string) => {
			businessLogger.logger.log(
				{ src: 5, evid: 603, form_type: 'default', ...generateParams(context, layout) },
				{ endpoint: 'site-members' }
			)
		},
		siteMembersFeatureLoaded: () => {
			businessLogger.logger.log({ src: 5, evid: 698, ...generateParams() }, { endpoint: 'site-members' })
		},
		siteMembersSdkFeatureLoaded: () => {
			businessLogger.logger.log({ src: 5, evid: 699, ...generateParams() }, { endpoint: 'site-members' })
		},
		siteMembersEmailConfirmationNewMembersModalLoad: () => {
			businessLogger.logger.log({ src: 5, evid: 1809, ...generateParams() }, { endpoint: 'site-members' })
		},
		siteMembersEmailConfirmationSendCodeClick: () => {
			businessLogger.logger.log({ src: 5, evid: 1810, ...generateParams() }, { endpoint: 'site-members' })
		},
		siteMembersEmailConfirmationOnResendCodeClick: () => {
			businessLogger.logger.log({ src: 5, evid: 1811, ...generateParams() }, { endpoint: 'site-members' })
		},
	}
}

const getCurrentTimeStamp = (biSession: WixBiSession) => {
	const start = biSession.initialTimestamp || 0
	return Date.now() - start
}
