import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerExtras } from '@wix/thunderbolt-symbols'
import { SiteMembersApiSymbol } from './symbols'
import type {
	ISiteMembersApi,
	CurrentMemberTPAHandlerResponse,
	TPARequestLoginOptions,
	TPALogoutOptions,
} from './types'
import { withViewModeRestriction } from '@wix/thunderbolt-commons'

const siteMembersTPAHandlers = (siteMembersApi: ISiteMembersApi) => ({
	getTpaHandlers() {
		const currentMember = async (
			_compId: never,
			_data: never,
			extras: TpaHandlerExtras
		): Promise<CurrentMemberTPAHandlerResponse> => {
			const member = await siteMembersApi.getMemberDetails(true)
			if (member) {
				if (!extras.appClientSpecMapData?.isWixTPA) {
					return {
						id: member.id,
						owner: member.owner,
						status: member.status,
					}
				} else {
					return {
						attributes: {
							firstName: member.firstName ?? '',
							lastName: member.lastName ?? '',
							privacyStatus: member.profilePrivacyStatus,
						},
						name: member.memberName,
						email: member.loginEmail,
						id: member.id,
						owner: member.owner,
						status: member.status,
					}
				}
			}

			return null
		}
		const requestLogin = async (
			_compId: string,
			dialogOptions: TPARequestLoginOptions = {}
		): Promise<CurrentMemberTPAHandlerResponse> => {
			const { member } = await siteMembersApi.promptLogin({
				mode: dialogOptions.mode,
				modal: dialogOptions.modal,
			})
			return {
				attributes: {
					firstName: member.firstName ?? '',
					lastName: member.lastName ?? '',
					privacyStatus: member.profilePrivacyStatus,
				},
				name: member.memberName,
				email: member.loginEmail,
				id: member.id,
				owner: member.owner,
				status: member.status,
			}
		}

		return {
			currentMember,
			smCurrentMember: currentMember,
			logOutCurrentMember: withViewModeRestriction(
				['site'],
				(_comp: string, options?: TPALogoutOptions): void => {
					siteMembersApi.logout(options?.url)
				}
			),
			requestLogin: withViewModeRestriction(['site'], requestLogin),
			smRequestLogin: withViewModeRestriction(['site'], requestLogin),
		}
	},
})

export const SiteMembersTPAHandlers = withDependencies([SiteMembersApiSymbol], siteMembersTPAHandlers)
