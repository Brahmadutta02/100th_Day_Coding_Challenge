import { WixSearchResult } from '../model/search-result'
import { toInternalSearchRequest, toRequestWithDefaults } from '../util/converters'
import WixSearchFilterBuilder from './filter'
import {
	validateCollectionName,
	validateLanguage,
	validateSkip,
	validateLimit,
	validateAscending,
	validateDescending,
	validateFilterField,
	validateFacets,
	validateFuzzy,
} from '../util/validators'
import {
	WixSearchPartialRequestData,
	WixSearchRequestPatchData,
	WixSearchSortDirection,
	WixSearchFilter,
} from '../types'

const filters = new WixSearchFilterBuilder()

export default class WixSearchBuilder {
	private _request: WixSearchPartialRequestData

	constructor(request: WixSearchPartialRequestData) {
		this._request = request
	}

	documentType(value: string): WixSearchBuilder {
		validateCollectionName(value)
		return this._patch({
			collectionName: value,
		})
	}

	language(value: string): WixSearchBuilder {
		validateLanguage(value)
		return this._patch({
			language: value,
		})
	}

	query(value: string): WixSearchBuilder {
		return this._patch({
			query: value,
		})
	}

	searchFields(fields: Array<string>): WixSearchBuilder {
		return this._patch({
			searchFields: fields,
		})
	}

	skip(value: number): WixSearchBuilder {
		validateSkip(value)
		return this._patch({
			skip: value,
		})
	}

	limit(value: number) {
		validateLimit(value)
		return this._patch({
			limit: value,
		})
	}

	facets(...clauses: Array<string>) {
		validateFacets(clauses)
		return this._patch({
			facets: clauses,
		})
	}

	fuzzy(value: boolean) {
		validateFuzzy(value)
		return this._patch({
			fuzzy: value,
		})
	}

	ascending(...fields: Array<string>) {
		validateAscending(fields)
		return this._appendSortClauses(fields, 'ASC')
	}

	descending(...fields: Array<string>) {
		validateDescending(fields)
		return this._appendSortClauses(fields, 'DESC')
	}

	_appendSortClauses(fields: Array<string>, direction: WixSearchSortDirection) {
		return this._patch({
			sort: (this._request.sort || []).concat(fields.map((f) => ({ fieldName: f, direction }))),
		})
	}

	eq(field: string, value: any) {
		validateFilterField('eq', field)
		const clause = filters.and(this._request.filter, filters.eq(field, value))
		return this._updateFilterClause(clause)
	}

	ne(field: string, value: any) {
		validateFilterField('ne', field)
		const clause = filters.and(this._request.filter, filters.ne(field, value))
		return this._updateFilterClause(clause)
	}

	gt(field: string, value: any) {
		validateFilterField('gt', field)
		const clause = filters.and(this._request.filter, filters.gt(field, value))
		return this._updateFilterClause(clause)
	}

	ge(field: string, value: any) {
		validateFilterField('ge', field)
		const clause = filters.and(this._request.filter, filters.ge(field, value))
		return this._updateFilterClause(clause)
	}

	lt(field: string, value: any) {
		validateFilterField('lt', field)
		const clause = filters.and(this._request.filter, filters.lt(field, value))
		return this._updateFilterClause(clause)
	}

	le(field: string, value: any) {
		validateFilterField('le', field)
		const clause = filters.and(this._request.filter, filters.le(field, value))
		return this._updateFilterClause(clause)
	}

	in(field: string, values: Array<any>) {
		validateFilterField('in', field)
		const clause = filters.and(this._request.filter, filters.in(field, values))
		return this._updateFilterClause(clause)
	}

	hasSome(field: string, values: Array<any>) {
		validateFilterField('hasSome', field)
		const clause = filters.and(this._request.filter, filters.hasSome(field, values))
		return this._updateFilterClause(clause)
	}

	hasAll(collectionField: string, values: Array<any>) {
		validateFilterField('hasAll', collectionField)
		const clause = filters.and(this._request.filter, filters.hasAll(collectionField, values))
		return this._updateFilterClause(clause)
	}

	and(...clauses: Array<WixSearchFilter>) {
		const clause = filters.and(...[this._request.filter].concat(clauses))
		return this._updateFilterClause(clause)
	}

	not(...clauses: Array<WixSearchFilter>) {
		const clause = filters.and(this._request.filter, filters.not(...clauses))
		return this._updateFilterClause(clause)
	}

	or(...clauses: Array<WixSearchFilter>) {
		const clause = filters.or(...[this._request.filter].concat(clauses))
		return this._updateFilterClause(clause)
	}

	_updateFilterClause(clause: WixSearchFilter | undefined) {
		return this._patch({
			filter: clause,
		})
	}

	async find() {
		const request = toRequestWithDefaults(this._request)
		const result = await this._request.client.search(toInternalSearchRequest(request))

		return new WixSearchResult({ request, result })
	}

	_patch(patch: WixSearchRequestPatchData): WixSearchBuilder {
		return new WixSearchBuilder({
			client: this._request.client,
			collectionName: this._request.collectionName,
			language: this._request.language,
			query: this._request.query,
			searchFields: this._request.searchFields,
			skip: this._request.skip,
			limit: this._request.limit,
			facets: this._request.facets,
			filter: this._request.filter,
			sort: this._request.sort,
			highlight: this._request.highlight,
			fuzzy: this._request.fuzzy,
			...patch,
		})
	}
}
