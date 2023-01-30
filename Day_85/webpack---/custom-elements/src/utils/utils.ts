// @ts-nocheck

const get = (obj, props, defVal) => {
	const path = Array.isArray(props) ? props : props.split('.')
	const val = path.reduce((subObj, prop) => (subObj && subObj[prop] !== undefined ? subObj[prop] : null), obj)
	return val !== null ? val : defVal
}

const pick = (obj, props) => {
	const propsArr = Array.isArray(props) ? props : [props]
	return propsArr.reduce((subObj, prop) => {
		const val = get(obj, prop)
		return val !== undefined ? Object.assign(subObj, { [prop]: val }) : subObj
	}, {})
}

const findKey = (obj, predicate) => Object.keys(obj).find((key) => predicate(obj[key], key))

/**
 * Return a unique Array from the input `arr` keeping the last item for each key
 * returned by `predicate(item)`
 *
 * @param {Array} arr
 * @param {function} predicate
 * @returns {Array}
 */
const unique = (arr, predicate) => {
	const result = arr.reduce((acc, item) => {
		acc[predicate(item)] = item
		return acc
	}, {})

	return Object.values(result)
}

const cssStringToObject = (styleStr) => {
	if (!styleStr || !styleStr.split) {
		return {}
	}

	return styleStr.split(';').reduce(function (ruleMap, ruleString) {
		const rulePair = ruleString.split(':')
		if (rulePair[0] && rulePair[1]) {
			ruleMap[rulePair[0].trim()] = rulePair[1].trim()
		}

		return ruleMap
	}, {})
}

/**
 * @param {Function} callback
 * @returns {Function}
 */
const throttleToAnimationFrame = (callback, contextWindow = window) => {
	let throttled = false

	return (...args) => {
		if (!throttled) {
			throttled = true

			contextWindow.requestAnimationFrame(() => {
				throttled = false
				callback(...args)
			})
		}
	}
}

/**
 * Join strings to a valid URL.
 *
 * {@see santa-core/santa-core-utils/src/coreUtils/core/urlUtils.js}
 * @param {...string[]} args
 * @return {string}
 */
function joinURL(...args) {
	let url = args[0]

	for (let i = 1; i < args.length; ++i) {
		url = `${url.replace(/\/$/, '')}/${args[i].replace(/^\//, '')}`
	}

	return url
}

export { get, pick, findKey, unique, cssStringToObject, throttleToAnimationFrame, joinURL }
