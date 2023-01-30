import { IMultilingual } from '@wix/thunderbolt-symbols'

export const currentLanguage = (language: string, multilingual?: Omit<IMultilingual, 'setCurrentLanguage'>): string => {
	if (multilingual && multilingual.currentLanguage && multilingual.currentLanguage.languageCode) {
		return multilingual.currentLanguage.languageCode
	}

	return language
}
