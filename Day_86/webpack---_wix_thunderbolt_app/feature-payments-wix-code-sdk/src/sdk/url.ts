import _ from 'lodash'

function stringifyUrlParams(params: any) {
	const pairs: Array<string> = []
	const addPair = (key: string, value: string) => pairs.push(`${key}=${value}`)

	_.entries(params).forEach(([key, value]) => {
		if (_.isPlainObject(value)) {
			// @ts-ignore
			Object.keys(value).forEach((objKey) => addPair(`${key}[${objKey}]`, value[objKey]))
		} else if (Array.isArray(value)) {
			value.forEach((item) => addPair(key, item))
		} else {
			// @ts-ignore
			addPair(key, value)
		}
	})

	return pairs.join('&')
}

export { stringifyUrlParams }
