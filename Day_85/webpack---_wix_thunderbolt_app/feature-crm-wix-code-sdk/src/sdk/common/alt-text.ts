// Based on https://github.com/wix-private/cloud-runtime/blob/master/packages/edm-autogen/runtime/cloud-edm-autogen-p13n/lib/image/toAltText.js
const splitCamelCase = (s) => s.replace(/([A-Z])/g, ' $1')

const removeExtension = (s) => s.replace(/\.\S*$/, '')

const trimConsequentSpaces = (s) => s.replace(/\s+/g, ' ')

const removeSpecialChars = (s) => s.replace(/[^a-zA-Z0-9]/g, ' ')

const lowercaseAllButFirst = (s) => {
	const [first, ...rest] = s.split(' ')

	return [first, ...rest.map((w) => w.toLowerCase())].join(' ')
}

export const parseAltText = (s) =>
	[
		decodeURIComponent,
		removeExtension,
		removeSpecialChars,
		trimConsequentSpaces,
		splitCamelCase,
		lowercaseAllButFirst,
	].reduce((acc, fn) => fn(acc), s)
