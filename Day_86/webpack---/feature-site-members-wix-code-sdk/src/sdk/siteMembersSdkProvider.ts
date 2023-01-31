import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	SdkHandlersProvider,
	LoggerSymbol,
	ILogger,
	AppDidMountPromiseSymbol,
	ISessionManager,
} from '@wix/thunderbolt-symbols'
import { SiteMembersWixCodeSdkHandlers } from '../types'
import {
	ISiteMembersApi,
	SiteMembersApiSymbol,
	PrivacyStatus,
	INTERACTIONS,
	isLoginAcceptableError,
} from 'feature-site-members'
import { SessionManagerSymbol } from 'feature-session-manager'
import { name } from '../symbols'

export const siteMembersWixCodeSdkHandlers = withDependencies(
	[SiteMembersApiSymbol, LoggerSymbol, AppDidMountPromiseSymbol, SessionManagerSymbol],
	(
		{
			login,
			promptLogin,
			promptForgotPassword,
			applySessionToken,
			getMemberDetails,
			register,
			registerToUserLogin,
			unRegisterToUserLogin,
			registerToMemberLogout,
			unRegisterToMemberLogout,
			logout,
			handleOauthToken,
			closeCustomAuthenticationDialogs,
			sendSetPasswordEmail,
		}: ISiteMembersApi,
		logger: ILogger,
		appDidMountPromise: Promise<unknown>,
		sessionManager: ISessionManager
	): SdkHandlersProvider<SiteMembersWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			[name]: {
				async login(email, password, options) {
					try {
						logger.interactionStarted(INTERACTIONS.CODE_LOGIN)
						const response = await login(email, password, options)
						logger.interactionEnded(INTERACTIONS.CODE_LOGIN)

						// In case someone opened the custom login popup using the popup API
						// we still wish to close the popup on a successful login
						closeCustomAuthenticationDialogs(true)
						return response
					} catch (error) {
						if (isLoginAcceptableError(error)) {
							logger.interactionEnded(INTERACTIONS.CODE_LOGIN)
						}

						throw error
					}
				},
				applySessionToken,
				promptForgotPassword,
				async promptLogin(options) {
					await appDidMountPromise
					const { member } = await promptLogin(options)
					return member
				},
				async register(email, password, options) {
					// We wish to allow consumers to manage the captcha by themselves
					const { member, approvalToken, status } = await register(
						email,
						password,
						options?.contactInfo,
						options.privacyStatus || PrivacyStatus.PRIVATE,
						undefined,
						undefined,
						options?.recaptchaToken
					)

					return {
						status,
						approvalToken,
						user: member,
					}
				},
				registerToUserLogin,
				unRegisterToUserLogin,
				registerToMemberLogout,
				unRegisterToMemberLogout,
				sendSetPasswordEmail,
				logout,
				getMemberDetails,
				handleOauthToken,
				getVisitorId: () => sessionManager.getVisitorId(),
			},
		}),
	})
)
