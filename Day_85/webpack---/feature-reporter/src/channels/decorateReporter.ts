import { channelNames } from '@wix/promote-analytics-adapter'
import type { BiProps } from './types'

export function decorateReporter(biProps: BiProps, name: string, reportFn: Function) {
	const biChannels = [channelNames.WIX_ANALYTICS, channelNames.BI_ANALYTICS]
	return biChannels.includes(name) ? enrichWithBiProps(biProps, reportFn) : reportFn
}

const languages: {
	browserLang: string | null
	preferredLang: string | null
} = {
	browserLang: null,
	preferredLang: null,
}

function getLanguages() {
	if (!process.env.browser) {
		return languages
	}

	if (languages.browserLang === null && languages.preferredLang === null) {
		languages.browserLang = window.navigator.language
		languages.preferredLang = window.navigator.languages ? window.navigator.languages.slice(0, 5).join(',') : ''
	}

	return languages
}

function enrichWithBiProps(biProps: BiProps, reportFn: Function) {
	return (params: any) => {
		const { browserLang, preferredLang } = getLanguages()

		params = {
			...params,
			uuid: biProps.userId,
			url: window.document.location.href,
			ref: window.document.referrer,
			bot: biProps.wixBiSession.isjp,
			bl: browserLang,
			pl: preferredLang,
		}

		return reportFn(params)
	}
}
