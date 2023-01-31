import WixSearchBuilder from '../builder/search'
import { toExternalDocument } from '../util/converters'
import {
	WixSearchRequestData,
	WixSearchResultData,
	WixSearchResultContainer,
	WixSearchExternalDocument,
	WixSearchTermAggregationResult,
} from '../types'

export class WixSearchResult {
	private _request: WixSearchRequestData
	private _result: WixSearchResultData

	constructor(obj: WixSearchResultContainer) {
		this._request = obj.request
		this._result = obj.result
	}

	get documents(): Array<WixSearchExternalDocument> {
		return this._result.documents.map((document) => toExternalDocument(this._request.collectionName, document))
	}

	get facets(): Array<WixSearchTermAggregationResult> {
		return this._result.facets.map((f) => f.terms)
	}

	get length(): number {
		return this.documents.length
	}

	get totalCount(): number {
		return this._result.nextPage.total
	}

	get pageSize(): number {
		return this._result.nextPage.limit
	}

	get totalPages(): number {
		return Math.ceil(this.totalCount / this.pageSize)
	}

	get currentPage(): number | undefined {
		if (this.totalCount > 0 && this._request.skip < this.totalCount) {
			return Math.floor((this.totalPages * this._request.skip) / this.totalCount)
		}

		return undefined
	}

	next(): Promise<WixSearchResult> {
		if (this.hasNext()) {
			const request = {
				...this._request,
				skip: this._request.skip + this._request.limit,
			}

			return new WixSearchBuilder(request).find()
		}

		throw new Error('Next page does not exist')
	}

	prev(): Promise<WixSearchResult> {
		if (this.hasPrev()) {
			const request = {
				...this._request,
				skip: this._request.skip - this._request.limit,
			}

			return new WixSearchBuilder(request).find()
		}

		throw new Error('Previous page does not exist')
	}

	hasNext(): boolean {
		if (this.currentPage === undefined) {
			return false
		}

		return this.currentPage < this.totalPages
	}

	hasPrev(): boolean {
		if (this.currentPage === undefined) {
			return false
		}

		return this.currentPage > 0
	}

	toJSON(): any {
		return {
			documents: this.documents,
			facets: this.facets,
			length: this.length,
			totalCount: this.totalCount,
		}
	}
}
