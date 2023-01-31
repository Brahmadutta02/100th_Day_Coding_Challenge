import { inferSchema } from './inferSchema'
import {
	isRef,
	traverse,
	SMALL_FACTOR,
	BIG_FACTOR,
	getByArray,
	setByArray,
	get3d,
	set3d,
	DEPTH,
	fromStringPath,
	toStringPath,
	pathToStringPath,
	EMPTY_SCHEMA,
} from './utils'
import { Queue } from './Queue'
import { toposort } from './toposort'
import { DataFragment, MaterializerFactory, Ref, RefProvider, Update, Schema, InvalidationList } from './types'

export const createMaterializer: MaterializerFactory = ({ transform } = {}) => {
	const template: Record<string, Record<string, Record<string, any>>> = {}
	const materialized: Record<string, Record<string, Record<string, any>>> = {}
	const schemas: Record<string, Record<string, Record<string, Schema>>> = {}
	const pendingInvalidations = new Set<string>()
	const index: Map<string, Set<string>> = new Map()
	let firstRun = true

	const addRefToIndex = (ref: Ref<any>, ownRefPath: string) => {
		const refPath = pathToStringPath(ref.refPath)
		if (!index.has(refPath)) {
			index.set(refPath, new Set<string>())
		}
		index.get(refPath)!.add(ownRefPath)
	}

	const removeRefFromIndex = (ref: unknown, ownRefPath: string) => {
		if (isRef(ref)) {
			const refPath = pathToStringPath(ref.refPath)
			index.get(refPath)?.delete(ownRefPath)

			return true
		}
	}

	const addSchemaToIndex = (schema: Schema, ownRefPath: string) => {
		traverse(
			schema,
			(val) => {
				if (isRef(val)) {
					addRefToIndex(val, ownRefPath)
					return true
				}
			},
			SMALL_FACTOR
		)
	}

	const removeSchemaFromIndex = (schema: Schema | typeof EMPTY_SCHEMA, ownRefPath: string) => {
		if (schema !== EMPTY_SCHEMA) {
			traverse(schema, (val) => removeRefFromIndex(val, ownRefPath), SMALL_FACTOR)
		}
	}

	const updateTemplate = (key1: string, key2: string, key3: string, newTemplate: DataFragment | undefined) => {
		pendingInvalidations.add(toStringPath(key1, key2, key3))

		if (typeof newTemplate === 'undefined') {
			delete template[key1]?.[key2]?.[key3]
			return
		}

		set3d(template, key1, key2, key3, newTemplate)
	}

	const mergeSchema = (key1: string, key2: string, key3: string, newSchema: DataFragment | typeof EMPTY_SCHEMA) => {
		const baseStringPath = toStringPath(key1, key2, key3)

		const currSchema = get3d(schemas, key1, key2, key3)
		if (newSchema === EMPTY_SCHEMA || isRef(newSchema)) {
			set3d(schemas, key1, key2, key3, newSchema)
			removeSchemaFromIndex(currSchema, baseStringPath)

			if (newSchema !== EMPTY_SCHEMA) {
				// @ts-ignore TODO Argument of type 'DataFragment' is not assignable to parameter of type 'Ref<any>'.
				addRefToIndex(newSchema, baseStringPath)
			}
			return
		}

		if (!currSchema || currSchema === EMPTY_SCHEMA) {
			set3d(schemas, key1, key2, key3, newSchema)
			addSchemaToIndex(newSchema, baseStringPath)
			return
		}

		// remove all refs from currSchema
		traverse(currSchema, (val) => removeRefFromIndex(val, baseStringPath), SMALL_FACTOR)

		let schemaToWrite: Schema

		traverse(
			newSchema,
			(newRef, path) => {
				if (!isRef(newRef)) {
					return
				}

				schemaToWrite = schemaToWrite || currSchema || {}
				setByArray(schemaToWrite, path, newRef)
				addRefToIndex(newRef, baseStringPath)
				return true
			},
			SMALL_FACTOR
		)

		if (schemaToWrite) {
			set3d(schemas, key1, key2, key3, schemaToWrite)
		}
	}

	const getAllInvalidations = (invalidations: Set<string>) => {
		const allInvalidations: Set<string> = new Set<string>()
		const queue = new Queue<Set<string>>(BIG_FACTOR)
		queue.enqueue(invalidations)
		while (!queue.isEmpty()) {
			const paths = queue.dequeue()
			for (const p of paths) {
				if (allInvalidations.has(p)) {
					continue
				}

				allInvalidations.add(p)
				if (index.has(p)) {
					queue.enqueue(index.get(p)!)
				}
			}
		}
		return allInvalidations
	}

	const populate = (invalidations: Set<string>) => {
		const allInvalidations: Set<string> = firstRun ? new Set(invalidations) : getAllInvalidations(invalidations)
		const paths = toposort(allInvalidations, index).map(fromStringPath) as InvalidationList

		for (const path of paths) {
			const [key1, key2, key3] = path
			if (!template[key1]?.[key2]) {
				continue
			}

			const val = get3d(template, key1, key2, key3)

			const nodeSchema = get3d(schemas, key1, key2, key3)
			if (nodeSchema === EMPTY_SCHEMA) {
				set3d(materialized, key1, key2, key3, transform ? transform(val, path) : val)
				continue
			}
			let newVal = {}
			traverse(
				val,
				(objValue, objPath) => {
					const schema = getByArray(nodeSchema, objPath)
					if (!schema) {
						setByArray(newVal, objPath, objValue)
						return true
					}
					if (schema.hasOwnProperty('$type')) {
						const resolved = getByArray(materialized, schema.refPath) ?? schema.defaultValue
						if (objPath.length > 0) {
							setByArray(newVal, objPath, resolved)
						} else {
							newVal = resolved
						}
						return true
					}
					if (Array.isArray(objValue)) {
						setByArray(newVal, objPath, [])
						return
					}
				},
				SMALL_FACTOR
			)
			set3d(materialized, key1, key2, key3, transform ? transform(newVal, path) : newVal)
		}

		firstRun = false
		return paths
	}

	const flush = () => {
		const recursiveInvalidations = populate(pendingInvalidations)

		pendingInvalidations.clear()

		return recursiveInvalidations
	}

	const updateWithoutFlush: Update<void> = (key1, key2, key3, data, schema = inferSchema(data)) => {
		if (typeof key3 === 'undefined') {
			if (!template[key1]?.[key2]) {
				return
			}

			for (const existingKey in template[key1][key2]) {
				mergeSchema(key1, key2, existingKey, EMPTY_SCHEMA)
				updateTemplate(key1, key2, existingKey, undefined)
			}

			delete schemas[key1]?.[key2]
			delete template[key1]?.[key2]
			delete materialized[key1]?.[key2]

			return
		}

		mergeSchema(key1, key2, key3, schema ?? EMPTY_SCHEMA)
		updateTemplate(key1, key2, key3, data)
	}

	return {
		update(key1, key2, key3, data, schema) {
			updateWithoutFlush(key1, key2, key3, data, schema)
			return flush()
		},
		batch(batchFunction) {
			batchFunction(updateWithoutFlush)
			return flush()
		},
		get: (path: string | Array<string | number>) =>
			getByArray(materialized, Array.isArray(path) ? path : path.split('.')),
	}
}

export const createRef = <T>(refPath: Array<string>, defaultValue?: any): Ref<T> => {
	if (refPath.length < DEPTH) {
		throw new Error(`Unsupported ref path, must be ${DEPTH} or more levels deep`)
	}
	return { $type: 'ref', refPath, defaultValue }
}

export function getBoundRefProvider(pathToBind: Array<string>): RefProvider {
	return <T>(innerPath: Array<string>, defaultValue?: any): Ref<T> =>
		createRef<T>([...pathToBind, ...innerPath], defaultValue)
}
