import type { IFetchApi, BrowserWindow } from '@wix/thunderbolt-symbols'
import type {
	MemberDetailsDTO,
	MemberDetails,
	SocialAuthComponentProps,
	IGetSocialAuthComponentProps,
	ISiteMembersSettings,
	ICaptchaSettings,
	AuthorizedPages,
	IAMPlatformLoginResponse,
	IMemberPayload,
	IAMStateStatus,
} from './types'
import {
	LOGIN_ERROR_CODES,
	SIGN_UP_ERROR_CODES,
	AUTH_RESULT_REASON,
	VERIFICATION_CODE_ERROR_CODES,
	INVISIBLE_CAPTCHA_API_KEY,
	AUTH_METHODS,
	ERROR_CODES,
} from './constants'
import _ from 'lodash'
import { IBsiManager } from 'feature-business-logger'
import { ISessionManager } from 'feature-session-manager'
import { loadScriptTag, getOpenCaptcha, getRuntimeStyleOverridesManager } from '@wix/thunderbolt-commons'

export const memberDetailsFromDTO = (memberDetailsDTO: MemberDetailsDTO): MemberDetails => ({
	id: memberDetailsDTO.id,
	emailVerified: memberDetailsDTO.attributes?.emailVerified,
	role: memberDetailsDTO.memberRole,
	owner: memberDetailsDTO.owner,
	loginEmail: memberDetailsDTO.email,
	memberName: memberDetailsDTO.name ?? memberDetailsDTO.attributes?.name ?? '',
	firstName: memberDetailsDTO.attributes?.firstName,
	lastName: memberDetailsDTO.attributes?.lastName,
	imageUrl: memberDetailsDTO.attributes?.imageUrl ?? '',
	nickname: memberDetailsDTO.attributes?.nickname,
	profilePrivacyStatus: memberDetailsDTO.attributes?.privacyStatus,
	slug: memberDetailsDTO.slug,
	status: memberDetailsDTO.status,
	creationDate: memberDetailsDTO.dateCreated,
	lastUpdateDate: memberDetailsDTO.dateUpdated,
	emails: [],
	phones: [],
	addresses: [],
	labels: [],
	groups: [],
	customFields: [],
})

export const memberDetailsFromIAMResponse = (response: IAMPlatformLoginResponse): MemberDetails => {
	const { identity, additionalData } = response
	const { identityProfile } = identity
	return {
		id: identity.id,
		emailVerified: !!(additionalData?.emailVerified as { numValue: number })?.numValue,
		role: (additionalData?.role as { strValue: string })?.strValue,
		owner: !!(additionalData?.isOwner as { numValue: number })?.numValue,
		loginEmail: identity.identifiers[0].email,
		memberName: identityProfile?.nickname,
		firstName: identityProfile?.firstName,
		lastName: identityProfile?.lastName,
		imageUrl: identityProfile?.imageUrl,
		nickname: identityProfile?.nickname,
		profilePrivacyStatus: identityProfile?.privacyStatus,
		slug: (additionalData?.slug as { strValue: string })?.strValue,
		status: identity.status,
		creationDate: identity.createdDate,
		lastUpdateDate: identity.updatedDate,
		emails: [],
		phones: [],
		addresses: [],
		labels: [],
		groups: [],
		customFields: [],
	}
}

export const hangingPromise = () => new Promise(() => {})

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getPerformFetch = (fetchApi: IFetchApi, requestInit: RequestInit, baseUrl: string) => (
	url: string,
	options: Partial<RequestInit> = {}
) => {
	const headers = {
		...requestInit.headers,
		...(options.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
		...options.headers,
		'x-wix-client-artifact-id': 'thunderbolt',
	}
	const optionsWithMergedHeaders = {
		...options,
		...{ headers },
	}

	// TODO: move this transformation into FetchApi
	const absoluteUrl = new URL(url, baseUrl).href

	return fetchApi
		.envFetch(absoluteUrl, { ...requestInit, ...optionsWithMergedHeaders })
		.then(async (response: Response) => {
			const data = await response.json()
			if (!response.ok) {
				// since we can't pass Response object between workers we better transform it now
				throw data
			}

			if (data.errorCode) {
				throw data.errorCode
			}
			return data
		})
}

const getErrorCode = (error: any) =>
	error?.details?.errorcode || error?.details?.errorCode || error?.details?.applicationError?.code

export const isLoginAcceptableError = (error: any) => {
	// In case of approval needed (admin approval / email approval)
	// we cancel the process and this considered an expected error
	if (error === AUTH_RESULT_REASON.CANCELED) {
		return true
	}
	const errorCode = getErrorCode(error)
	return LOGIN_ERROR_CODES.includes(errorCode)
}

export const isSignupAcceptableError = (error: any) => {
	// In case of approval needed (admin approval / email approval)
	// we cancel the process and this considered an expected error
	if (error === AUTH_RESULT_REASON.CANCELED) {
		return true
	}
	const errorCode = getErrorCode(error)
	return SIGN_UP_ERROR_CODES.includes(errorCode)
}

export const isVerificationCodeError = (error: any) => {
	const errorCode = getErrorCode(error)
	return VERIFICATION_CODE_ERROR_CODES.includes(errorCode)
}

const isUnsupportedFeatureError = (error: any) => {
	const errorCode = getErrorCode(error)
	return errorCode === ERROR_CODES.UNIMPLEMENTED_FEATURE
}

const getBsi = (bsiManager?: IBsiManager) => {
	const bsiRaw = bsiManager?.getBsi()
	// The bsi has a weird format: guid|pageNumber, we only need the guid
	return bsiRaw ? bsiRaw.split('|')[0] : '00000000-0000-0000-0000-000000000000'
}

export const getVisitorId = (sessionManager: ISessionManager) =>
	sessionManager.getVisitorId() ?? '00000000-0000-0000-0000-000000000000'
export const _getSocialAuthComponentProps: IGetSocialAuthComponentProps = ({
	config,
	viewerModel,
	sessionManager,
	bsiManager,
	handleOauthToken,
	handleSocialLoginResponse,
	isSocialAuthSupported,
	captcha,
	userLanguage,
}) => {
	// We don't want the bsi, biVisitorId, and svSession to be cached
	const props: SocialAuthComponentProps = {
		bsi: '00000000-0000-0000-0000-000000000000',
		biVisitorId: '00000000-0000-0000-0000-000000000000',
		svSession: sessionManager.getUserSession()!,
		smCollectionId: config.smcollectionId,
		metaSiteId: viewerModel.site.metaSiteId,
		isSocialAuthSupported,
		// Will be called by the component after mounting the iframe to determine what to send inside via postMessage
		getHostReadyPayload: () => ({
			visitorId: getVisitorId(sessionManager),
			svSession: sessionManager.getUserSession()!,
			bsi: getBsi(bsiManager),
		}),
		openCaptcha: getOpenCaptcha({ captcha, userLanguage }),
	}
	if (handleOauthToken && handleSocialLoginResponse) {
		props.onTokenMessage = (token: string, vendor: string, joinCommunityChecked: boolean = false) => {
			const joinCommunityStatus = joinCommunityChecked ? 'PUBLIC' : 'PRIVATE'
			return handleOauthToken(token, vendor, 'socialAuthComponent', joinCommunityStatus)
		}
		props.onBackendSocialLogin = handleSocialLoginResponse
	}

	return props
}

const CONTACT_INFO_SYSTEM_FIELDS: Record<string, Object> = {
	id: {},
	firstName: {},
	lastName: {},
	picture: {},
	emails: {},
	addresses: {},
	phones: {},
	labels: {},
}

const CONTACT_INFO_HIDDEN_SYSTEM_FIELDS: Record<string, Object> = {
	emailVerified: {},
	role: {},
	loginEmail: {},
	nickname: {},
	slug: {},
	language: {},
	status: {},
	creationDate: {},
	lastUpdateDate: {},
	lastLoginDate: {},
	profilePrivacyStatus: {},
}

const customFieldType = (value: any) => {
	if (_.isDate(value)) {
		return 'dateValue'
	} else if (Number.isInteger(value)) {
		return 'numValue'
	}
	return 'strValue'
}

export const serializeContactInfo = (rawContactInfo: Record<string, any>) =>
	Object.entries(rawContactInfo).reduce(
		(result: Record<string, any>, [key, value]) => {
			const systemField = CONTACT_INFO_SYSTEM_FIELDS[key]
			const hiddenField = CONTACT_INFO_HIDDEN_SYSTEM_FIELDS[key]
			if (systemField) {
				result[key] = value
			} else if (!hiddenField && key) {
				result.customFields.push({
					name: key,
					[customFieldType(value)]: value,
				})
			}
			return result
		},
		{ customFields: [] }
	)

export const serializeIdentityProfile = (rawContactInfo: Record<string, any>) =>
	Object.entries(rawContactInfo).reduce(
		(result: Record<string, any>, [key, value]) => {
			const systemField = CONTACT_INFO_SYSTEM_FIELDS[key]
			const hiddenField = CONTACT_INFO_HIDDEN_SYSTEM_FIELDS[key]
			if (systemField) {
				result[key] = value
			} else if (!hiddenField && key) {
				result.customFields.push({
					name: key,
					value: {
						[customFieldType(value)]: value,
					},
				})
			}
			return result
		},
		{ customFields: [] }
	)

const getGoogleSdkScriptUrl = (language: string, render: string) =>
	`https://www.google.com/recaptcha/enterprise.js?render=${render}&hl=${language}`

export const googleSdkFactory = (
	browserWindow: BrowserWindow,
	runtimeStyleOverridesManager: ReturnType<typeof getRuntimeStyleOverridesManager>
) => {
	const api = {
		loadScript(language: string, render: string) {
			if (browserWindow?.grecaptcha) {
				return browserWindow.grecaptcha
			}

			return loadScriptTag(getGoogleSdkScriptUrl(language, render))
		},
		showCaptchaBadge() {
			setTimeout(() => {
				runtimeStyleOverridesManager.setItemCssOverrides(
					{ visibility: 'visible', 'z-index': 'var(--portals-z-index)' },
					'.grecaptcha-badge',
					browserWindow as NonNullable<BrowserWindow>
				)
			}, 1000)
		},
		hideCaptchaBadge() {
			runtimeStyleOverridesManager.setItemCssOverrides(
				{ visibility: 'hidden' },
				'.grecaptcha-badge',
				browserWindow as NonNullable<BrowserWindow>
			)
		},
		setCaptchaBadgeVisibility(shouldShowBadge: boolean) {
			if (shouldShowBadge) {
				return api.showCaptchaBadge()
			}
			api.hideCaptchaBadge()
		},
	}

	return api
}

export const CAPTCHA_SETTINGS_OPTIONS = {
	UNKNOWN: 'UNKNOWN',
	NEVER: 'NEVER',
	SUSPECTED_BOTS_ONLY: 'SUSPECTED_BOTS_ONLY',
	ALWAYS: 'ALWAYS',
}

export const getCaptchaSettings = (smSettings: ISiteMembersSettings): ICaptchaSettings => {
	return {
		invisible: {
			login: smSettings?.loginRecaptchaOption === CAPTCHA_SETTINGS_OPTIONS.SUSPECTED_BOTS_ONLY,
			signup: smSettings?.signupRecaptchaOption === CAPTCHA_SETTINGS_OPTIONS.SUSPECTED_BOTS_ONLY,
		},
		visible: {
			login: smSettings?.loginRecaptchaOption === CAPTCHA_SETTINGS_OPTIONS.ALWAYS,
			signup: smSettings?.signupRecaptchaOption === CAPTCHA_SETTINGS_OPTIONS.ALWAYS,
		},
	}
}

export const getInvisibleCaptchaTokenFactory = (window: BrowserWindow) => (
	action: typeof AUTH_METHODS[keyof typeof AUTH_METHODS]
) => {
	try {
		return window?.grecaptcha?.enterprise?.execute(INVISIBLE_CAPTCHA_API_KEY, {
			action,
		})
	} catch (error) {
		return undefined
	}
}

export const toAuthorizedPages = (protectedPages: {
	mapValue: {
		value: {
			[pageId: string]: {
				strValue: string
			}
		}
	}
}): AuthorizedPages => _.mapValues(protectedPages?.mapValue?.value ?? [], 'strValue')

export const toLoginResponse = (
	socialLoginResponse: IMemberPayload | IAMPlatformLoginResponse
): { token?: string; member: MemberDetails; pages?: AuthorizedPages; status?: IAMStateStatus } => {
	if (socialLoginResponse.additionalData) {
		const member = memberDetailsFromIAMResponse(socialLoginResponse)
		const token = socialLoginResponse.sessionToken
		const pages = toAuthorizedPages(socialLoginResponse.additionalData?.protectedPages as any)
		const status = socialLoginResponse.state.status

		return { member, token, pages, status }
	} else {
		// When the user signing up to a site with members approval requirement
		// we won't get an smSession but we would get `siteMembersDto` inside our payload
		let token, siteMemberDto
		if (socialLoginResponse.smSession) {
			siteMemberDto = socialLoginResponse.smSession.siteMemberDto
			token = socialLoginResponse.smSession.sessionToken
		}
		siteMemberDto = socialLoginResponse.siteMemberDto
		const member = memberDetailsFromDTO(siteMemberDto)

		return { member, token }
	}
}

export async function performIAMCallWithFallback<T>(
	useIAM: boolean,
	iamMethod: () => T,
	legacyMethod: () => T
): Promise<T> {
	if (useIAM) {
		try {
			return await iamMethod()
		} catch (error) {
			if (isUnsupportedFeatureError(error)) {
				return legacyMethod()
			}
			throw error
		}
	}

	return legacyMethod()
}
