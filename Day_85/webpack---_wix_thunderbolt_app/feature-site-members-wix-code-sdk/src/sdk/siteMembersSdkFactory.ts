import { ConsentPolicy } from '@wix/cookie-consent-policy-client'
import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { WixCodeApiFactoryArgs, ConsentPolicyChangedHandler, Experiments } from '@wix/thunderbolt-symbols'
import { ConsentPolicyInteraction, createConsentPolicyLogger } from 'feature-consent-policy'
import { IStatus, MemberDetails, memberDetailsFromDTO, SiteMembersSiteConfig } from 'feature-site-members'
import type {
	SiteMembersSdkMethods,
	SiteMembersWixCodeSdkHandlers,
	SiteMembersWixCodeSdkWixCodeApi,
	LegacySiteMembersWixCodeSdkWixCodeApi,
	LoginHandler,
	RegistrationOptions,
	LegacyRegistrationResult,
	RegistrationResult,
	Fieldset,
	MemberRoleDTO,
	VeloMember,
} from '../types'
import { UserErrors, REGISTRATION_RESULT_STATUS_DISPLAY } from '../types'
import { getWithCaptchaChallengeHandler, mockMemberDetailsOnPreviewMode } from '../utils'
import { namespace, memberNamespace, name } from '../symbols'
import { User } from '../user/user'
import { apis, formatPlatformizedHttpError, handleErrors, onAuthHandler } from '../user/utils'
import { validateEmailUserParams } from './validations'
import { MembersSdk } from './members'
import { MembersLoginHandler } from '..'
import { createUser } from '../user/user.new'

const createUserControl = (experiments: Experiments) => (...args: Parameters<typeof createUser>) => {
	if (experiments['specs.thunderbolt.userAsFactory']) {
		return createUser(...args)
	}
	return new User(...args)
}

export async function SiteMembersSdkFactory({
	featureConfig,
	handlers,
	appEssentials,
	platformEnvData,
	platformUtils,
	wixCodeNamespacesRegistry,
	onPageWillUnmount,
}: WixCodeApiFactoryArgs<SiteMembersSiteConfig, never, SiteMembersWixCodeSdkHandlers>): Promise<{
	[memberNamespace]?: SiteMembersWixCodeSdkWixCodeApi
	[namespace]: LegacySiteMembersWixCodeSdkWixCodeApi
}> {
	const { locationManager, sessionService, biUtils, essentials, consentPolicyManager } = platformUtils
	const { httpClient } = appEssentials
	const { smToken, smcollectionId, isEditMode, isPreviewMode } = featureConfig
	const {
		login,
		applySessionToken,
		promptForgotPassword,
		promptLogin,
		register,
		registerToUserLogin,
		unRegisterToUserLogin,
		registerToMemberLogout,
		unRegisterToMemberLogout,
		logout,
		getMemberDetails,
		handleOauthToken,
		sendSetPasswordEmail,
		getVisitorId,
	}: SiteMembersSdkMethods = handlers[name]
	const isLiveSite = !isEditMode

	const {
		window: { isSSR },
		location: { externalBaseUrl: baseUrl, metaSiteId },
		site: { experiments },
	} = platformEnvData

	const _createUser = createUserControl(experiments)

	const membersSdk = new MembersSdk(sessionService, httpClient, isPreviewMode)

	const getMemberDetailsUrl = new URL(
		`/_api/wix-sm-webapp/member/${smToken}?collectionId=${smcollectionId}&metaSiteId=${metaSiteId}`,
		locationManager.getLocation().href
	).href

	const getMemberDetailsForSSR: () => Promise<MemberDetails | null> = () =>
		sessionService.getSmToken()
			? self
					.fetch(getMemberDetailsUrl, {
						headers: {
							'x-wix-client-artifact-id': 'thunderbolt',
						},
					})
					.then((r) => r.json())
					.then((r) => (r.errorCode ? null : memberDetailsFromDTO(r.payload)))
			: Promise.resolve(null)

	const _getMemberDetails = isSSR ? getMemberDetailsForSSR : getMemberDetails
	const refs = { getMemberDetails: _getMemberDetails, isLiveSite }

	const memberDetails = isEditMode
		? mockMemberDetailsOnPreviewMode(sessionService)
		: await _getMemberDetails().catch(() => null)
	const currentUser = _createUser(
		{ ...memberDetails, uid: memberDetails?.id, svSession: sessionService.getUserSession() },
		memberDetails ? REGISTRATION_RESULT_STATUS_DISPLAY[memberDetails.status as IStatus] : undefined,
		baseUrl,
		refs,
		experiments,
		sessionService.getWixCodeInstance()
	)
	const onLogin: Record<string, Array<LoginHandler | MembersLoginHandler>> = { users: [], members: [] }
	// I know it's silly to have a dictionary with a one key but I prefer consistency with onLogin structure
	const onLogout: Record<string, Array<() => void>> = { members: [] }

	const sendUserEmailApi = apis.sendUserEmailApi(baseUrl)
	const fedopsLogger = createFedopsLogger({
		appName: 'site-members-wix-code-sdk',
		biLoggerFactory: biUtils.createBiLoggerFactoryForFedops(),
		phasesConfig: 'SEND_START_AND_FINISH',
		customParams: {
			viewerName: 'thunderbolt',
		},
		factory: essentials.createFedopsLogger,
	})

	const { executeAndLog, executeAndLogAsync } = createConsentPolicyLogger(fedopsLogger)

	const _login: LegacySiteMembersWixCodeSdkWixCodeApi['login'] = async (email, password, options) => {
		const withCaptchaChallengeHandler = getWithCaptchaChallengeHandler(wixCodeNamespacesRegistry)
		if (options?.recaptchaToken) {
			await login(email, password, options)
		} else {
			await withCaptchaChallengeHandler((recaptchaToken) =>
				login(email, password, { ...(options || {}), recaptchaToken })
			)
		}
	}
	const _emailUser: LegacySiteMembersWixCodeSdkWixCodeApi['emailUser'] = async (emailId, toUser, options) => {
		fedopsLogger.interactionStarted('email-user')
		let processedOptions
		try {
			processedOptions = validateEmailUserParams(emailId, toUser, options).processedOptions
		} catch (err) {
			fedopsLogger.interactionEnded('email-user')
			throw err
		}
		const params = { emailId, memberId: toUser, options: processedOptions }
		const response = await fetch(sendUserEmailApi, {
			method: 'POST',
			headers: { authorization: sessionService.getWixCodeInstance() || '' },
			body: JSON.stringify(params),
		})
		if (!response.ok) {
			throw new Error(await response.text())
		}
		fedopsLogger.interactionEnded('email-user')
	}
	type IPromptLogin = (
		isMembersApi: boolean
	) =>
		| LegacySiteMembersWixCodeSdkWixCodeApi['promptLogin']
		| SiteMembersWixCodeSdkWixCodeApi['authentication']['promptLogin']
	const _promptLogin: IPromptLogin = (isMembersApi: boolean) => async (
		options
	): Promise<VeloMember | User | undefined> => {
		if (isSSR) {
			return new Promise(() => {})
		}
		const member = await promptLogin(options)
		// We can count on currentUser being updated because login is guaranteed not to
		// resolve before all onLogin callbacks (including the one that updates currentMember)
		// have resolved.
		//
		// TODO: The above was suppose to be true but we have a bug there and it's summer so
		// I have no time to figure it out so I made a patch to a production bug and initiate a new instance.
		// We better off fixing it as this initialization is basically redundant.
		if (!isMembersApi) {
			legacyApi.currentUser = _createUser(
				{ ...member, uid: member?.id, svSession: sessionService.getUserSession() },
				member ? REGISTRATION_RESULT_STATUS_DISPLAY[member.status as IStatus] : undefined,
				baseUrl,
				refs,
				experiments,
				sessionService.getWixCodeInstance()
			)
			return legacyApi.currentUser
		}
		return getMember({ fieldsets: ['FULL'] })
	}
	type IRegister = (
		isMembersApi: boolean
	) =>
		| LegacySiteMembersWixCodeSdkWixCodeApi['register']
		| SiteMembersWixCodeSdkWixCodeApi['authentication']['register']
	const _register: IRegister = (isMembersApi: boolean) => async (
		email: string,
		password: string,
		options: RegistrationOptions = {}
	) => {
		const withCaptchaChallengeHandler = getWithCaptchaChallengeHandler(wixCodeNamespacesRegistry)
		try {
			const data = options?.recaptchaToken
				? await register(email, password, options)
				: await withCaptchaChallengeHandler((recaptchaToken) =>
						register(email, password, { ...(options || {}), recaptchaToken })
				  )
			const response = {
				status: data.status,
				...(data.approvalToken ? { approvalToken: data.approvalToken } : {}),
			}
			if (isMembersApi) {
				return {
					...response,
					member: await getMember({ fieldsets: ['FULL'] }),
				} as RegistrationResult
			}
			const user = _createUser(
				{
					uid: data.user?.id,
					svSession: sessionService.getUserSession(),
					...data.user,
				},
				REGISTRATION_RESULT_STATUS_DISPLAY[data.status],
				baseUrl,
				refs,
				experiments,
				sessionService.getWixCodeInstance()
			)
			return {
				...response,
				user,
			} as LegacyRegistrationResult
		} catch (error) {
			if (error.message) {
				console.error(error.message)
				return Promise.reject(error.message)
			}
			// TODO: Shouldn't we handle a case where there is no error message?
		}
	}

	const getMember = async (
		{ fieldsets }: { fieldsets?: Array<Fieldset> } = { fieldsets: ['FULL'] }
	): Promise<VeloMember | undefined> => {
		return membersSdk.getMyMember(fieldsets)
	}

	const makeProfilePublic = async (): Promise<VeloMember | undefined> => {
		return membersSdk.joinCommunity()
	}

	const makeProfilePrivate = async (): Promise<VeloMember | undefined> => {
		return membersSdk.leaveCommunity()
	}

	const getRoles = () => {
		if (!sessionService.getSmToken()) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return fetch(apis.currentUserRolesUrl(baseUrl), {
			headers: { authorization: sessionService.getWixCodeInstance() || '' },
		})
			.then(handleErrors)
			.then((res: { groups: Array<MemberRoleDTO> }) =>
				res.groups.map(({ id: _id, createdDate: _createdDate, ...rest }) => {
					return { _id, _createdDate, ...rest }
				})
			)
			.catch((error: any) => Promise.reject(formatPlatformizedHttpError(error)))
	}

	const legacyApi: LegacySiteMembersWixCodeSdkWixCodeApi = {
		currentUser,
		login: _login,
		applySessionToken,
		emailUser: _emailUser,
		promptForgotPassword,
		promptLogin: _promptLogin(false),
		register: _register(false),
		onLogin(handler: LoginHandler) {
			onLogin.users = [...onLogin.users, handler]
		},
		logout,
		async handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string) {
			await handleOauthToken(token, provider, mode, joinCommunityStatus)
		},
		getCurrentConsentPolicy() {
			return executeAndLog(consentPolicyManager.getDetails, ConsentPolicyInteraction.GET_CURRENT_CONSENT_POLICY)
		},
		_getConsentPolicyHeader() {
			return consentPolicyManager.getHeader()
		},
		setConsentPolicy(policy: ConsentPolicy) {
			return executeAndLogAsync(
				() => consentPolicyManager.setPolicy(policy),
				ConsentPolicyInteraction.SET_CONSENT_POLICY
			)
		},
		resetConsentPolicy() {
			return executeAndLogAsync(consentPolicyManager.resetPolicy, ConsentPolicyInteraction.RESET_CONSENT_POLICY)
		},
		onConsentPolicyChanged(handler: ConsentPolicyChangedHandler) {
			return executeAndLog(
				() => consentPolicyManager.onChanged(handler),
				ConsentPolicyInteraction.ON_CONSENT_POLICY_CHANGED
			)
		},
		supportsPopupAutoClose: true,
	}

	const api: SiteMembersWixCodeSdkWixCodeApi = {
		currentMember: {
			getMember,
			makeProfilePublic,
			makeProfilePrivate,
			getRoles,
		},
		authentication: {
			loggedIn() {
				return !!sessionService.getSmToken()
			},
			login: _login,
			applySessionToken,
			promptForgotPassword,
			promptLogin: _promptLogin(true),
			register: _register(true),
			onLogin(handler: MembersLoginHandler) {
				onLogin.members = [...onLogin.members, handler]
			},
			onLogout(handler: () => void) {
				onLogout.members = [...onLogout.members, handler]
			},
			logout,
			sendSetPasswordEmail,
			getVisitorId,
		},
		async handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string) {
			await handleOauthToken(token, provider, mode, joinCommunityStatus)
		},
		supportsPopupAutoClose: true,
	}

	if (process.env.browser && isLiveSite) {
		registerToUserLogin(async () => {
			const newMemberDetails = await getMemberDetails()
			legacyApi.currentUser = _createUser(
				{ ...newMemberDetails, uid: newMemberDetails?.id, svSession: sessionService.getUserSession() },
				newMemberDetails ? REGISTRATION_RESULT_STATUS_DISPLAY[newMemberDetails.status] : undefined,
				baseUrl,
				refs,
				experiments,
				sessionService.getWixCodeInstance()
			)

			return Promise.all([
				...onLogin.users.map(onAuthHandler(legacyApi.currentUser)),
				...onLogin.members.map(onAuthHandler(api.currentMember)),
			])
		}).then((callbackId) => onPageWillUnmount(() => unRegisterToUserLogin(callbackId)))

		registerToMemberLogout(() => Promise.all(onLogout.members.map(onAuthHandler()))).then((callbackId) =>
			onPageWillUnmount(() => unRegisterToMemberLogout(callbackId))
		)
	}

	return {
		[namespace]: legacyApi,
		[memberNamespace]: api,
	}
}
