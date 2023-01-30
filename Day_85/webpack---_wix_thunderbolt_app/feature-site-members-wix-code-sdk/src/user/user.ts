import { Experiments } from '@wix/thunderbolt-symbols'
import { REGISTRATION_RESULT_STATUS_DISPLAY, UserRoles, UserErrors } from '../types'
import { apis, formatPlatformizedHttpError, handleErrors, serializeMemberPlans, serializeMemberRoles } from './utils'
import { MemberDetails, ISiteMembersApi } from 'feature-site-members'

interface IRefs {
	getMemberDetails: ISiteMembersApi['getMemberDetails']
	isLiveSite: boolean
}
export interface Member extends MemberDetails {
	uid: string
	svSession: string
}

let authorizationSingleton = ''
let baseUrlSingleton = ''
let _refs: IRefs

export class User {
	public id?: string
	public loggedIn: boolean = false
	public role: UserRoles
	private experiments: Experiments

	constructor(
		memberData: Partial<Member>,
		status: REGISTRATION_RESULT_STATUS_DISPLAY | undefined,
		baseUrl: string,
		refs: IRefs,
		experiments: Experiments,
		authorization?: string
	) {
		_refs = refs
		baseUrlSingleton = baseUrl
		authorizationSingleton = authorization || ''
		if (memberData.uid && status === REGISTRATION_RESULT_STATUS_DISPLAY.PENDING) {
			this.id = memberData.uid
			this.role = UserRoles.VISITOR
		} else if (memberData.uid) {
			this.id = memberData.uid
			this.loggedIn = true
			this.role = memberData.role === 'OWNER' ? UserRoles.ADMIN : UserRoles.MEMBER
		} else {
			this.id = memberData.svSession
			this.role = UserRoles.VISITOR
		}
		this.experiments = experiments
	}

	private getMembersApi = async () => {
		const membersNgApi = await import(
			'@wix/ambassador-members-ng-api/http' /* webpackChunkName: "ambassadorMembersNgApi" */
		)

		return membersNgApi.MembersNgApi('/_api/members').Members()({
			'x-wix-client-artifact-id': 'thunderbolt',
			authorization: authorizationSingleton,
		})
	}

	public getEmail() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return this.getCurrentMember(authorizationSingleton).then(({ member }: any) =>
			member ? member.loginEmail || member.email : Promise.reject(UserErrors.NO_LOGGED_IN)
		)
	}

	public getPricingPlans() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return this.getUserPlans(this.id, authorizationSingleton).catch((error: any) =>
			Promise.reject(formatPlatformizedHttpError(error))
		)
	}

	public getSlug() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}

		return this.getCurrentMember(authorizationSingleton).then(({ member }: any) => {
			return member ? member.slug || member?.profile.slug : Promise.reject(UserErrors.NO_LOGGED_IN)
		})
	}

	public getRoles() {
		if (!this.loggedIn) {
			return Promise.reject(UserErrors.NO_LOGGED_IN)
		}
		return fetch(apis.currentUserRolesUrl(baseUrlSingleton), { headers: { authorization: authorizationSingleton } })
			.then(handleErrors)
			.then(serializeMemberRoles)
			.catch((error: any) => Promise.reject(formatPlatformizedHttpError(error)))
	}

	private async getCurrentMember(authorization: string) {
		if (this.experiments['specs.thunderbolt.fetchMemberFromMembersNg']) {
			const membersApi = await this.getMembersApi()
			return membersApi.getMyMember({ fieldsets: ['EXTENDED'] })
		}

		if (!_refs.isLiveSite) {
			const member = await _refs.getMemberDetails()
			return { member }
		}
		return this.fetchCurrentMember(authorization).catch((error: any) =>
			Promise.reject(formatPlatformizedHttpError(error))
		)
	}

	private async fetchCurrentMember(authorization: string) {
		return fetch(apis.currentUserDetails(baseUrlSingleton), { headers: { authorization } }).then(handleErrors)
	}

	private getUserPlans = (userId: string | undefined, authorization: string) => {
		if (!userId) {
			return Promise.resolve([])
		}
		const plans = fetch(apis.currentUserPlansUrl(baseUrlSingleton), { headers: { authorization } }).then(
			handleErrors
		)
		const memberships = fetch(apis.plansMembershipsUrl(baseUrlSingleton, userId), {
			headers: { authorization },
		}).then(handleErrors)

		return Promise.all([plans, memberships]).then(([plansJson, membershipsJson]) =>
			serializeMemberPlans(plansJson, membershipsJson)
		)
	}
}
