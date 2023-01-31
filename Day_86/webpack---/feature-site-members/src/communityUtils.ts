import type { Experiments } from '@wix/thunderbolt-symbols'
import type { PrivacyNoteType, SiteMembersMasterPageConfig } from './types'

type SmSettings = SiteMembersMasterPageConfig['smSettings']

// Some sites may not have privacyNoteType set. In that case, default value is CHECKBOX
const getPrivacyNoteType = (smSettings: SmSettings): PrivacyNoteType => {
	const joinCommunityCheckedByDefault = smSettings.joinCommunityCheckedByDefault ?? true
	const privacyNoteType = smSettings.privacyNoteType ?? 'CHECKBOX'
	return joinCommunityCheckedByDefault ? privacyNoteType : 'CHECKBOX'
}

const getJoinCommunityCheckedByDefault = (smSettings: SmSettings) => {
	const privacyNoteType = getPrivacyNoteType(smSettings)
	if (privacyNoteType === 'NOTE') {
		return true
	}
	return smSettings.joinCommunityCheckedByDefault ?? true
}

export const getCommunityOptions = (
	smSettings: SmSettings,
	experiments: Experiments
): { privacyNoteType: PrivacyNoteType; joinCommunityCheckedByDefault: boolean } => {
	return experiments['specs.thunderbolt.enableSignUpPrivacyNoteType']
		? {
				privacyNoteType: getPrivacyNoteType(smSettings),
				joinCommunityCheckedByDefault: getJoinCommunityCheckedByDefault(smSettings),
		  }
		: {
				privacyNoteType: 'CHECKBOX',
				joinCommunityCheckedByDefault: smSettings.joinCommunityCheckedByDefault ?? true,
		  }
}
