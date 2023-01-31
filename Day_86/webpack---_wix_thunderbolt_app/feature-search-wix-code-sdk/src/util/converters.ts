import { getDocumentType } from '../model/document-types'
import {
	WixSearchRequestData,
	WixSearchInternalRequestData,
	WixSearchDocumentImage,
	WixSearchDocument,
	WixSearchExternalDocument,
	WixSearchPartialRequestData,
} from '../types'

export const toRequestWithDefaults = (request: WixSearchPartialRequestData): WixSearchRequestData => {
	if (!request) {
		return request
	}

	return {
		client: request.client,
		collectionName: request.collectionName,
		language: request.language,
		query: request.query || '*',
		searchFields: request.searchFields || [],
		skip: request.skip || 0,
		limit: request.limit || 25,
		facets: request.facets || [],
		filter: request.filter || {},
		sort: request.sort || [],
		highlight: request.highlight,
		fuzzy: request.fuzzy,
	}
}

export const toInternalSearchRequest = (request: WixSearchRequestData): WixSearchInternalRequestData => {
	return {
		query: request.query,
		documentType: getDocumentType(request.collectionName),
		language: request.language,
		searchFields: request.searchFields,
		paging: {
			skip: request.skip,
			limit: request.limit,
		},
		ordering: {
			ordering: request.sort,
		},
		facets: {
			clauses: request.facets.map((f) => ({ term: { name: f } })),
		},
		filter: request.filter,
		highlight: request.highlight,
		fuzzy: request.fuzzy,
	}
}

const toMediaImage = (documentImage: WixSearchDocumentImage): string | null => {
	if (!documentImage || !documentImage.name) {
		return null
	}
	const imageName = documentImage.name
	if (/^https?:\/\//.test(imageName) || /^wix:image:\/\//.test(imageName)) {
		return imageName
	}
	if (!documentImage.width || !documentImage.height) {
		return null
	}
	return `wix:image://v1/${imageName}/${imageName}#originWidth=${documentImage.width}&originHeight=${documentImage.height}`
}

export const toExternalDocument = (
	requestedCollectionName: string | undefined,
	document: WixSearchDocument
): WixSearchExternalDocument => {
	const { id, documentImage, ...rest } = document

	const result = {
		...rest,
		_id: id,
		image: toMediaImage(documentImage),
		documentType: requestedCollectionName,
	}

	return result
}
