import { ISiteMembersApi } from 'feature-site-members'
import { LoginSocialBarFeatureProps } from '@wix/thunderbolt-components'

type LoginSocialBarMemberDetails = Pick<LoginSocialBarFeatureProps, 'isLoggedIn' | 'userName' | 'avatarUri'>

export const resolveMemberDetails = async (siteMembersApi: ISiteMembersApi): Promise<LoginSocialBarMemberDetails> => {
	let membersData = {
		isLoggedIn: false,
		userName: '',
		avatarUri: '',
	}
	try {
		const memberDetails = await siteMembersApi.getMemberDetails()
		if (memberDetails) {
			membersData = {
				isLoggedIn: true,
				userName: memberDetails.nickname || memberDetails.memberName || memberDetails.loginEmail,
				avatarUri: memberDetails.imageUrl,
			}
		}
	} catch (e) {
		console.error('failed to fetch member details', e)
	}
	return membersData
}
