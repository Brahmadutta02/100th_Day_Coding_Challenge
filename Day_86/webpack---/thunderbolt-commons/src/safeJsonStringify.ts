const closingTagRegex = /\//g
const scaryCharactersRegex = /[\u2028\u2029\u000b]/g // eslint-disable-line no-control-regex
const escape = (str: string) => str.replace(closingTagRegex, '\\/').replace(scaryCharactersRegex, '')
// we JSON.stringify(json) in order to remove undefined values
export const safeJsonStringify = (json: any) => escape(JSON.stringify(json))
