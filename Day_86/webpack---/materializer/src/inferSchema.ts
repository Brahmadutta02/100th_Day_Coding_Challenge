import { InferSchema, Schema } from './types'
import { setByArray, isObjectLike, isRef, traverse, SMALL_FACTOR, EMPTY_SCHEMA } from './utils'

export const inferSchema: InferSchema = (dataFragment) => {
	if (isRef(dataFragment)) {
		return dataFragment
	}

	if (!isObjectLike(dataFragment)) {
		return EMPTY_SCHEMA
	}

	let schema: Schema | undefined
	traverse(
		dataFragment,
		(value, path) => {
			if (Array.isArray(value)) {
				schema = schema || {}
				setByArray(schema, path, [])
				return false
			}
			if (isRef(value)) {
				schema = schema || {}
				setByArray(schema, path, value)
				return true
			}
		},
		SMALL_FACTOR
	)
	return schema
}
