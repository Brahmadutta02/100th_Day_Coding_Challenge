import { values, keyBy, flatMap } from 'lodash'

const DOCUMENT_TYPE_KEY = 'DOCUMENT_TYPE'
const COLLECTION_NAME_KEY = 'COLLECTION_NAME'
const DEPRECATED_BY_KEY = 'DEPRECATED_BY'

const SUPPORTED_VERTICALS = {
	STORES: {
		PRODUCTS: {
			[DOCUMENT_TYPE_KEY]: 'public/stores/products',
			[COLLECTION_NAME_KEY]: 'Stores/Products',
		},
	},
	SITE: {
		PAGES: {
			[DOCUMENT_TYPE_KEY]: 'public/site/pages',
			[COLLECTION_NAME_KEY]: 'Site/Pages',
		},
	},
	BLOG: {
		POSTS: {
			[DOCUMENT_TYPE_KEY]: 'public/blog/posts',
			[COLLECTION_NAME_KEY]: 'Blog/Posts',
		},
	},
	BOOKINGS: {
		SERVICES: {
			[DOCUMENT_TYPE_KEY]: 'public/booking/services',
			[COLLECTION_NAME_KEY]: 'Bookings/Services',
		},
	},
	FORUM: {
		POSTS: {
			[DOCUMENT_TYPE_KEY]: 'public/forum/content',
			[COLLECTION_NAME_KEY]: 'Forum/Posts',
			[DEPRECATED_BY_KEY]: 'Forum/Content',
		},
		CONTENT: {
			[DOCUMENT_TYPE_KEY]: 'public/forum/content',
			[COLLECTION_NAME_KEY]: 'Forum/Content',
		},
	},
}

const projected = (from: string) => keyBy(flatMap(values(SUPPORTED_VERTICALS), values), from)

const COLLECTION_NAMES_TO_VALUES = projected(COLLECTION_NAME_KEY)

export const getDocumentType = (collectionName: string | undefined): string | undefined => {
	if (!collectionName) {
		console.error(
			'Search across all document types has been deprecated. Support for this feature will be dropped in future releases of the Search API. Use a specific document type to ensure compatibility with future versions of the Search API.'
		)
	}

	const entry = COLLECTION_NAMES_TO_VALUES[collectionName as string]
	if (entry) {
		if (entry[DEPRECATED_BY_KEY]) {
			console.warn(
				`You are using a deprecated document type '${collectionName}'. Support will be dropped in future releases of the Search API. Please change the document type to '${entry[DEPRECATED_BY_KEY]}' to ensure compatibility with future versions of the Search API.'`
			)
		}

		return entry[DOCUMENT_TYPE_KEY]
	}

	return undefined
}
