import { name } from './symbols'
import type { User } from './user/user'
import type {
	ISiteMembersApi,
	MemberDetails,
	IStatus,
	LoginOptions,
	PrivacyStatus,
	ILoginOptions,
} from 'feature-site-members'
import { ISessionManager } from '@wix/thunderbolt-symbols'
import type { ConsentPolicy, PolicyDetails, PolicyHeaderObject } from '@wix/cookie-consent-policy-client'
import type { ConsentPolicyChangedHandler } from '@wix/thunderbolt-symbols'
import { Status, ActivityStatusStatus, PrivacyStatusStatus, Image as MemberImage, Contact } from './sdk/memberTypes'

export type Fieldset = 'FULL' | 'PUBLIC'

export interface Profile {
	nickname?: String
	profilePhoto?: MemberImage
	coverPhoto?: MemberImage
	title?: String
	slug?: String
}

export interface VeloMember {
	_id?: String
	contactId?: String
	loginEmail?: String
	profile: Profile
	contactDetails?: Contact
	activityStatus?: ActivityStatusStatus
	privacyStatus?: PrivacyStatusStatus
	status?: Status
	lastLoginDate?: Date
	_createdDate?: Date
	_updatedDate?: Date
}

export interface LegacySiteMembersWixCodeSdkWixCodeApi {
	currentUser: User

	login(email: string, password: string, options?: ILoginOptions): Promise<void>

	applySessionToken(sessionToken: string): Promise<void>

	emailUser(emailId: string, toUser: string, options?: TriggeredEmailOptions): Promise<void>

	promptForgotPassword(language?: string): Promise<void>

	promptLogin(options: LoginOptions): Promise<User | VeloMember | undefined>

	register(
		email: string,
		password: string,
		options?: RegistrationOptions
	): Promise<LegacyRegistrationResult | RegistrationResult | undefined>

	onLogin(handler: LoginHandler): void

	logout(): void

	handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string): Promise<void>

	getCurrentConsentPolicy(): PolicyDetails

	_getConsentPolicyHeader(): PolicyHeaderObject

	setConsentPolicy(policy: ConsentPolicy): Promise<PolicyDetails>

	resetConsentPolicy(): Promise<void>

	onConsentPolicyChanged(handler: ConsentPolicyChangedHandler): void

	supportsPopupAutoClose?: boolean
}

export interface SiteMembersWixCodeSdkWixCodeApi {
	currentMember: {
		getMember({ fieldsets }: { fieldsets?: Array<Fieldset> }): Promise<VeloMember | undefined>
		makeProfilePublic(): Promise<VeloMember | undefined>
		makeProfilePrivate(): Promise<VeloMember | undefined>
		getRoles(): Promise<Array<MemberRole>>
	}
	authentication: {
		loggedIn(): boolean
		login(email: string, password: string): Promise<void>
		logout(): void
		onLogin(handler: MembersLoginHandler): void
		onLogout(handler: () => void): void
		promptForgotPassword(language?: string): Promise<void>
		promptLogin(options: LoginOptions): Promise<User | VeloMember | undefined>
		applySessionToken(sessionToken: string): Promise<void>
		sendSetPasswordEmail?(email: string, options?: { hideIgnoreMessage?: boolean }): Promise<boolean>
		register(
			email: string,
			password: string,
			options?: RegistrationOptions
		): Promise<LegacyRegistrationResult | RegistrationResult | undefined>
		getVisitorId: ISessionManager['getVisitorId']
	}

	handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string): Promise<void>

	supportsPopupAutoClose?: boolean
}

export type SiteMembersSdkMethods = {
	login: ISiteMembersApi['login']

	applySessionToken(sessionToken: string): Promise<void>

	promptForgotPassword(language?: string): Promise<void>

	promptLogin(options: LoginOptions): Promise<MemberDetails>

	register(
		email: string,
		password: string,
		options: RegistrationOptions
	): Promise<{
		status: IStatus
		approvalToken?: string
		user: MemberDetails
	}>

	registerToUserLogin(handler: () => any): Promise<string>
	unRegisterToUserLogin(callbackId: string): void

	registerToMemberLogout(handler: () => void): Promise<string>
	unRegisterToMemberLogout(callbackId: string): void

	logout(): void

	getMemberDetails: ISiteMembersApi['getMemberDetails']
	handleOauthToken: ISiteMembersApi['handleOauthToken']
	sendSetPasswordEmail: ISiteMembersApi['sendSetPasswordEmail']
	getVisitorId: ISessionManager['getVisitorId']
}

export type SiteMembersWixCodeSdkHandlers = {
	[name]: SiteMembersSdkMethods
}

export type SiteMembersWixCodeSdkHandlersEditor = {
	[name]: {
		login(email: string, password: string, options?: ILoginOptions): Promise<void>
		applySessionToken(sessionToken: string): Promise<void>
		promptForgotPassword(language?: string): Promise<void>
		promptLogin(options: LoginOptions): Promise<void>
		register(email: string, password: string, options: RegistrationOptions): Promise<void>
		registerToUserLogin(handler: () => any): void
		registerToMemberLogout(handler: () => void): void
		logout(): void
		getMemberDetails: ISiteMembersApi['getMemberDetails']
		handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string): Promise<void>
		sendSetPasswordEmail(email: string, options?: { hideIgnoreMessage?: boolean }): Promise<void>
	}
}

export type RegistrationOptions = {
	contactInfo?: IContactInfo
	privacyStatus?: PrivacyStatus
	recaptchaToken?: string | null
}

export type IContactInfo = {
	firstName?: string
	lastName?: string
	picture?: string
	emails?: Array<string>
	loginEmail?: string
	phones?: Array<string>
	labels?: Array<string>
	language?: string
	customFields: Array<any>
}

type TriggeredEmailOptions = {
	variables: Record<string, any>
}

export type LegacyRegistrationResult = {
	status: IStatus
	approvalToken?: string
	user: User
}

export type RegistrationResult = {
	status: IStatus
	approvalToken?: string
	member: VeloMember | null
}

export type LoginHandler = (user: User) => void
export type MembersLoginHandler = (member: SiteMembersWixCodeSdkWixCodeApi['currentMember']) => void

export interface LegacyMemberDTO {
	addresses: Array<Address | string>
	contactId?: string
	creationDate?: string
	customFields: Array<any>
	emailVerified: boolean
	emails: Array<string>
	firstName?: string
	groups: Array<Group>
	id: string
	imageUrl?: string
	labels: Array<string>
	language?: string
	lastLoginDate?: string
	lastName?: string
	lastUpdateDate?: string
	loginEmail?: string
	memberName?: string
	nickname?: string
	phones: Array<string>
	picture?: Image
	profilePrivacyStatus: V1SiteMemberPrivacyStatus
	role: Role
	slug?: string
	status: V1SiteMemberStatus
	userId?: string
}

export interface Address {
	city?: string
	country?: string
	postalCode?: string
	region?: string
	street?: string
}

interface Group {
	id: string
	name: string
	type: string
}

interface Image {
	height: number
	id: string
	url: string
	width: number
}

export enum V1SiteMemberPrivacyStatus {
	PRIVATE = 'PRIVATE',
	COMMUNITY = 'COMMUNITY',
	UNDEFINED = 'UNDEFINED',
	PUBLIC = 'PUBLIC',
}

export enum Role {
	OWNER = 'OWNER',
	CONTRIBUTOR = 'CONTRIBUTOR',
	MEMBER = 'MEMBER',
	UNDEFINED_ROLE = 'UNDEFINED_ROLE',
}

export enum V1SiteMemberStatus {
	APPLICANT = 'APPLICANT',
	BLOCKED = 'BLOCKED',
	UNDEFINED_STATUS = 'UNDEFINED_STATUS',
	OFFLINE_ONLY = 'OFFLINE_ONLY',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum REGISTRATION_RESULT_STATUS_DISPLAY {
	ACTIVE = 'Active',
	PENDING = 'Pending',
	APPLICANT = 'Applicant',
}

export enum UserRoles {
	VISITOR = 'Visitor',
	MEMBER = 'Member',
	ADMIN = 'Admin',
}

export enum UserErrors {
	NO_INSTANCE_FOUND = 'wix code is not enabled',
	CLOSE_DIALOG = 'The user closed the login dialog',
	NO_LOGGED_IN = 'No user is currently logged in',
	NOT_ALLOWED_IN_PREVIEW = 'Action not allowed in preview mode',
	AWAITING_APPROVAL = 'Member login request has been sent and is awaiting approval',
}

export enum AppDefIds {
	wixCode = '675bbcef-18d8-41f5-800e-131ec9e08762',
	shoutOut = '135c3d92-0fea-1f9d-2ba5-2a1dfb04297e',
}

export type IGetMemberDetails = ISiteMembersApi['getMemberDetails']

/**
 * Site feature config is calculated in SSR when creating the `viewerModel`
 * The config is available to your feature by injecting `named(PageFeatureConfigSymbol, name)`
 */
export type SiteMembersWixCodeSdkSiteConfig = {
	smToken: string
	smcollectionId: string
	isEditMode: boolean
	isPreviewMode: boolean
}

export interface MemberRoleDTO {
	id: string
	createdDate: string
	title?: string
	description?: string
	type?: string
	color?: string
}

export interface MemberRole extends Omit<MemberRoleDTO, 'id' | 'createdDate'> {
	_id: string
	_createdDate: string
}
