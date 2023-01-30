// NOTICE - THIS PATTERN ISN'T THE GLOBAL PATTTERN USED IN FINDALL (https://github.com/wix-private/santa-core/blob/05634a69bf8c0b70847fd8e6449da7afdd1fe76a/santa-core-utils/src/coreUtils/core/textPatternRecognizer.js#L10)
const PHONE_NUMBER_PATTERN = /(?:\+|\()?\d(?:[-.() \t\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{0,5}\d){6,16}\)?(?![<@)\w])|\*\d{4}(?![<@)\w])/
const PHONE_NUMBER_AS_WORD_PATTERN = /(?:^|[\s:;,<>])(?:\+|\()?\d(?:[-.() \t\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{0,5}\d){6,16}\)?(?![<@)\w])|\*\d{4}(?![<@)\w])/
const EMAIL_PATTERN = /(^|[\s:;,<>])([A-Z0-9][A-Z0-9._%+-]+@[A-Z0-9][A-Z0-9.-]+\.[A-Z]{2,})(?=$|[\s:;,<>])/i // http://www.regular-expressions.info/email.html
const URL_PATTERN = /(^|[\s:;,<>])((?:https?:\/\/|www\.)[a-z0-9](?:\.?[a-z0-9\-%_])*(?:(?:\\|\/)[a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%]*)?)(?=$|[^a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%])/i

const GLOBAL_PHONE_NUMBER_AS_WORD_PATTERN = new RegExp(PHONE_NUMBER_AS_WORD_PATTERN, 'g')
const GLOBAL_EMAIL_PATTERN = /([A-Z0-9][A-Z0-9._%+-]+@[A-Z0-9][A-Z0-9.-]+\.[A-Z]{2,})/gi
const GLOBAL_URL_PATTERN = /((?:https?:\/\/|www\.)[a-z0-9](?:\.?[a-z0-9\-%_])*(?:(?:\\|\/)[a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%]*)?)/gi

export const PatternType = {
	PHONE: 'PHONE',
	MAIL: 'MAIL',
	URL: 'URL',
} as const

export interface MatchingResult {
	key: string
	value: string
	index: number
	pattern: keyof typeof PatternType
}

type MatchingFunc = (text: string) => MatchingResult | null

type PatternSpecifier = { [key in keyof typeof PatternType]?: boolean }

const findPhoneNumber: MatchingFunc = (text) => {
	const matching = text.match(PHONE_NUMBER_PATTERN)
	return (
		matching && {
			key: matching[0],
			value: matching[0].match(/[*\d]/g)!.join(''),
			index: matching.index!,
			pattern: PatternType.PHONE,
		}
	)
}

const findEmail: MatchingFunc = (text) => {
	const matching = text.match(EMAIL_PATTERN)
	if (matching) {
		const prefixSize = matching[1].length
		const mainCapture = matching[2]
		return {
			key: mainCapture,
			value: mainCapture,
			index: matching.index! + prefixSize,
			pattern: PatternType.MAIL,
		}
	} else {
		return null
	}
}

export const getUrlWithProtocol = (url: string) => {
	const beginsWithHttp = url.toLowerCase().indexOf('http') === 0
	return beginsWithHttp ? url : `http://${url}`
}

const findUrl: MatchingFunc = (text) => {
	const matching = text.match(URL_PATTERN)
	if (matching) {
		const mainCapture = matching[2]
		const prefixSize = matching[1].length
		const value = getUrlWithProtocol(mainCapture)
		return {
			key: mainCapture,
			value,
			index: matching.index! + prefixSize,
			pattern: PatternType.URL,
		}
	} else {
		return null
	}
}

type TextReplacer = (substring: string, ...args: Array<any>) => string

export const replaceEmails = (str: string, replacer: TextReplacer) => str.replace(GLOBAL_EMAIL_PATTERN, replacer)

const possiblePrefixes = [' ', ':', ';', ',', '<', '>']
export const replacePhoneNumbers = (str: string, replacer: TextReplacer) => {
	return str.replace(GLOBAL_PHONE_NUMBER_AS_WORD_PATTERN, (match) => {
		const prefix = possiblePrefixes.find((i) => i === match[0])
		return prefix ? prefix + replacer(match.substring(1, match.length)) : replacer(match)
	})
}

export const replaceUrls = (str: string, replacer: TextReplacer) => str.replace(GLOBAL_URL_PATTERN, replacer)

const patternToMatchingFunc: { [key in keyof typeof PatternType]: MatchingFunc } = {
	[PatternType.PHONE]: findPhoneNumber,
	[PatternType.MAIL]: findEmail,
	[PatternType.URL]: findUrl,
}

export function findFirstMatch(text: string, patterns: PatternSpecifier = {}): MatchingResult | null {
	if (!text) {
		return null
	}
	const matches = Object.keys(patterns)
		.filter((key) => patterns[key as keyof PatternSpecifier])
		.map((key) => patternToMatchingFunc[key as keyof PatternSpecifier](text))
		.filter((value) => value !== null)
	const firstMatch = matches[0]
		? matches.reduce((prev, curr) => {
				return curr!.index < prev!.index ? curr : prev
		  }, matches[0])
		: null
	return firstMatch
}
