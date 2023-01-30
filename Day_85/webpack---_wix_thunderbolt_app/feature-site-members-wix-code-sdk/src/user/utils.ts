import { Experiments } from '@wix/thunderbolt-symbols'
import { ISiteMembersApi } from 'feature-site-members'

export const apis = {
	currentUserDetails: (baseUrl: string) => `${baseUrl}/api/wix-sm/v1/members/current`,
	currentUserRolesUrl: (baseUrl: string) =>
		`${baseUrl}/_api/members-groups-web/v1/groups/users/current?include_implicit_groups=true&groupType=role`,
	currentUserPlansUrl: (baseUrl: string) =>
		`${baseUrl}/_api/members-groups-web/v1/groups/users/current?include_implicit_groups=true&groupType=plan`,
	plansMembershipsUrl: (baseUrl: string, userId: string) =>
		`${baseUrl}/_api/members-groups-web/v1/groups/users/${userId}/memberships?type=plan`,
	sendUserEmailApi: (baseUrl: string) => `${baseUrl}/_api/shoutout/v1/emailMember`,
}

export const formatPlatformizedHttpError = function (response: any) {
	const status = response.status,
		responseText = response?.text()
	if (!status && !responseText) {
		return response
	}
	if (status === 400) {
		return 'Bad Request: please check the user inputs.'
	}
	if (status === 404) {
		return 'Not Found: the requested item no longer exists.'
	}
	let errorMessage
	try {
		errorMessage = JSON.parse(responseText).message
	} catch (e) {
		/* do nothing */
	}
	return (errorMessage || 'unknown failure') + ' (' + (status || 0) + ')'
}

export const handleErrors = (response: Response) => {
	if (!response.ok) {
		Promise.reject(response)
	}
	return response.json()
}

export const serializeMemberRoles = (rawRoles: any) => {
	if (!rawRoles?.groups) {
		return []
	}
	return rawRoles.groups.map((role: any) => {
		return { name: role.title, description: role.description }
	})
}

export const onAuthHandler = (callbackArguments?: any) => (handler: any) => {
	try {
		return handler(callbackArguments)
	} catch (e) {
		console.error(e)
	}
}

export const getMembersApi = async (authorization: string) => {
	const membersNgApi = await import(
		'@wix/ambassador-members-ng-api/http' /* webpackChunkName: "ambassadorMembersNgApi" */
	)

	return membersNgApi.MembersNgApi('/_api/members').Members()({
		'x-wix-client-artifact-id': 'thunderbolt',
		authorization,
	})
}

export const getCurrentMember = (experiments: Experiments) => async ({
	authorization,
	baseUrl,
	isLiveSite,
	getMemberDetails,
}: {
	authorization: string
	baseUrl: string
	isLiveSite: boolean
	getMemberDetails: ISiteMembersApi['getMemberDetails']
}) => {
	if (experiments['specs.thunderbolt.fetchMemberFromMembersNg']) {
		const membersApi = await getMembersApi(authorization)
		return membersApi.getMyMember({ fieldsets: ['EXTENDED'] })
	}

	if (!isLiveSite) {
		const member = await getMemberDetails()
		return { member }
	}
	return fetchCurrentMember(authorization, baseUrl).catch((error: any) =>
		Promise.reject(formatPlatformizedHttpError(error))
	)
}

export const fetchCurrentMember = async (authorization: string, baseUrl: string) => {
	return fetch(apis.currentUserDetails(baseUrl), { headers: { authorization } }).then(handleErrors)
}

export const getUserPlans = (userId: string | undefined, authorization: string, baseUrl: string) => {
	if (!userId) {
		return Promise.resolve([])
	}
	const plans = fetch(apis.currentUserPlansUrl(baseUrl), { headers: { authorization } }).then(handleErrors)
	const memberships = fetch(apis.plansMembershipsUrl(baseUrl, userId), {
		headers: { authorization },
	}).then(handleErrors)

	return Promise.all([plans, memberships]).then(([plansJson, membershipsJson]) =>
		serializeMemberPlans(plansJson, membershipsJson)
	)
}

export const serializeMemberPlans = (plansJson: any, membershipsJson: any) => {
	const plans = (plansJson && plansJson.groups) || []
	const memberships = (membershipsJson && membershipsJson.memberships) || []
	return plans.map((plan: any) => {
		const membership = memberships.find((_membership: any) => {
			return _membership.groupId === plan.id
		})
		const res: any = { name: plan.title }
		if (membership && membership.startDate) {
			res.startDate = new Date(membership.startDate)
		}
		if (membership && membership.expiryDate) {
			res.expiryDate = new Date(membership.expiryDate)
		}
		return res
	})
}
