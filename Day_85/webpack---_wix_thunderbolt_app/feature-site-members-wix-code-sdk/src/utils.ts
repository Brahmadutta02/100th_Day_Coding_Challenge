import { AuthenticationWixCodeSdkWixCodeApi } from 'feature-authentication-wix-code-sdk'
import { SessionServiceAPI, WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { MemberDetails } from 'feature-site-members'

export const getWithCaptchaChallengeHandler = (
	wixCodeNamespacesRegistry: WixCodeApiFactoryArgs['wixCodeNamespacesRegistry']
) => {
	const { withCaptchaChallengeHandler } = wixCodeNamespacesRegistry.get(
		'authentication'
	) as AuthenticationWixCodeSdkWixCodeApi
	return withCaptchaChallengeHandler
}

export const mockMemberDetailsOnPreviewMode = (sessionService: SessionServiceAPI): MemberDetails => {
	const memberId: string = sessionService.getSiteMemberId() ?? ''
	return {
		id: memberId,
		emailVerified: true,
		status: 'ACTIVE',
		role: 'OWNER',
		owner: true,
		loginEmail: '',
		memberName: '',
		firstName: '',
		groups: [],
		lastName: '',
		imageUrl: '',
		nickname: '',
		profilePrivacyStatus: '',
		slug: '',
		creationDate: '',
		lastUpdateDate: '',
		lastLoginDate: '',
		emails: [],
		phones: [],
		addresses: [],
		labels: [],
		customFields: [],
	}
}
