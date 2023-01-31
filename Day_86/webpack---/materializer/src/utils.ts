const PATH_SEPARATOR = '🐒🧿🐌🍕🍅'

import { Queue } from './Queue'
import { Visitor, Node, Ref } from './types'

export const BIG_FACTOR = 32
export const SMALL_FACTOR = 16

export const EMPTY_ARRAY: Array<Array<string>> = []
export const EMPTY_SCHEMA = Symbol.for('EMPTY_SCHEMA')

export const DEPTH = 3

export const isObjectLike = (item: unknown) => Array.isArray(item) || typeof item === 'object'

export const getByArray = (obj: any, path: Array<string | number>) => {
	let val = obj
	for (const pathPart of path) {
		val = val[pathPart]
		if (typeof val === 'undefined') {
			return undefined
		}
	}

	return val
}

export const getByString = (obj: any, path: string) => getByArray(obj, path.split(PATH_SEPARATOR))

export const setByArray = (obj: any, path: Array<string | number>, value: unknown) => {
	let val = obj
	let i = 0
	for (; i < path.length - 1; i++) {
		val[path[i]] = val[path[i]] || {}
		val = val[path[i]]
	}
	val[path[i]] = value
}

export const setByString = (obj: any, path: string, value: unknown) =>
	setByArray(obj, path.split(PATH_SEPARATOR), value)

export const hasByArray = (obj: any, pathArray: Array<string>) => {
	let val = obj
	for (const pathPart of pathArray) {
		if (val.hasOwnProperty(pathPart)) {
			val = val[pathPart]
		} else {
			return false
		}
	}

	return true
}

export const get3d = (object: Record<string, any>, key1: string, key2: string, key3: string) =>
	object[key1]?.[key2]?.[key3]

export const set3d = (object: Record<string, any>, key1: string, key2: string, key3: string, value: any) => {
	object[key1] = object[key1] || {}
	object[key1][key2] = object[key1][key2] || {}
	object[key1][key2][key3] = value
}

export const pathToStringPath = ([key1, key2, key3]: Array<string>) => toStringPath(key1, key2, key3)

export const toStringPath = (key1: string, key2: string, key3: string) =>
	`${key1}${PATH_SEPARATOR}${key2}${PATH_SEPARATOR}${key3}`

export const fromStringPath = (path: string) => path.split(PATH_SEPARATOR)

export const traverse = (obj: any, visit: Visitor, queueFactor: number) => {
	const queue = new Queue<Node>(queueFactor)
	queue.enqueue({ path: [], val: obj })

	while (!queue.isEmpty()) {
		const next = queue.dequeue()
		if (!visit(next.val, next.path)) {
			const type = typeof next.val
			if (
				!next.val ||
				type === 'string' ||
				type === 'number' ||
				type === 'boolean' ||
				type === 'symbol' ||
				type === 'function'
			) {
				continue
			}
			if (Array.isArray(next.val)) {
				for (let i = 0; i < next.val.length; i++) {
					queue.enqueue({
						path: [...next.path, i],
						val: next.val[i],
					})
				}
			} else {
				const keys = Object.keys(next.val)
				for (const key of keys) {
					queue.enqueue({
						path: [...next.path, key],
						val: next.val[key],
					})
				}
			}
		}
	}
}

export const isRef = (x: any): x is Ref<any> =>
	typeof x === 'object' && x !== null && x.hasOwnProperty('$type') && x.$type === 'ref'
