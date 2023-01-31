export type DynamicSessionModel = {
	apps: {
		[appDefId: string]: {
			instance: string
		}
	}
	ctToken: string
	hs: number
	mediaAuthToken: string
	svSession: string
	visitorId: string
	siteMemberId?: string
	smToken?: string
}

export type Instance = string
export type LoadNewSessionReason =
	| 'noSpecificReason'
	| 'memberLogin'
	| 'expiry'
	| 'newUserSession'
	| 'firstLoad'
	| 'OTP expiry'

export const SITE_CONTEXT_OTP_QUERY_PARAM = 'siteContextOTP'

export type OnLoadSessionCallback = ({
	results,
	reason,
}: {
	results: {
		instances: { [appDefinitionId: string]: Instance }
		siteMemberId?: string
		visitorId?: string
		svSession?: string
		smToken?: string
	}
	reason: LoadNewSessionReason
}) => void

export interface ISessionManager {
	getAppInstanceByAppDefId(appDefId: string): string | undefined
	getSiteMemberId(): string | undefined
	getVisitorId(): string | undefined
	getSmToken(): string | undefined
	getUserSession(): string | undefined
	getCtToken(): string | undefined
	getAllInstances(): DynamicSessionModel['apps']
	getHubSecurityToken(): string | 'NO_HS'
	setUserSession(userSession: string): void
	addLoadNewSessionCallback(callback: OnLoadSessionCallback): () => void
	// @ts-ignore
	loadNewSession({ reason, otp }?: { reason: LoadNewSessionReason; otp?: string }): Promise<void>
}
