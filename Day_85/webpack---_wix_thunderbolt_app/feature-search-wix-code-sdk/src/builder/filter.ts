import { WixSearchFilter } from '../types'

const filterClause = (field: string, operator: string, value: any) => {
	return { [field]: { [operator]: value } }
}

const isNonEmptyClause = (clause: WixSearchFilter | undefined) => {
	return clause && Object.keys(clause).length > 0 && clause.constructor === Object
}

export default class WixSearchFilterBuilder {
	and(...clauses: Array<WixSearchFilter | undefined>) {
		const nonEmptyClauses = clauses.filter(isNonEmptyClause)
		if (nonEmptyClauses.length > 1) {
			return { $and: nonEmptyClauses }
		}

		return nonEmptyClauses[0]
	}

	or(...clauses: Array<WixSearchFilter | undefined>) {
		const nonEmptyClauses = clauses.filter(isNonEmptyClause)
		if (nonEmptyClauses.length > 1) {
			return { $or: nonEmptyClauses }
		}

		return nonEmptyClauses[0]
	}

	not(...clauses: Array<WixSearchFilter | undefined>) {
		const nonEmptyClauses = clauses.filter(isNonEmptyClause)
		if (nonEmptyClauses.length > 1) {
			return { $not: { $and: nonEmptyClauses } }
		}

		return { $not: nonEmptyClauses[0] }
	}

	eq(field: string, value: any) {
		return filterClause(field, '$eq', value)
	}

	ne(field: string, value: any) {
		return filterClause(field, '$ne', value)
	}

	lt(field: string, value: any) {
		return filterClause(field, '$lt', value)
	}

	le(field: string, value: any) {
		return filterClause(field, '$lte', value)
	}

	gt(field: string, value: any) {
		return filterClause(field, '$gt', value)
	}

	ge(field: string, value: any) {
		return filterClause(field, '$gte', value)
	}

	in(field: string, values: Array<any>) {
		return filterClause(field, '$in', values)
	}

	hasAll(field: string, values: Array<any>) {
		return filterClause(field, '$all', values)
	}

	hasSome(field: string, values: Array<any>) {
		return filterClause(field, '$any', values)
	}
}
