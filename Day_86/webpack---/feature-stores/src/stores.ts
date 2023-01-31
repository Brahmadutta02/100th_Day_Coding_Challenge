import { Store, Subscriber } from '@wix/thunderbolt-symbols'
import { getFullId, isRepeatedComponentOfTemplate } from '@wix/thunderbolt-commons'

type Subscribers<T> = Array<Subscriber<T>>

export const getStore = <T extends { [key: string]: any }>(): Store<T> => {
	let stores = [] as Array<{ id: string; store: T }>
	let generalStore = {} as T

	const getPageStore = (id: string, pageId?: string): T => {
		// Although we use Array.find the number of stores is 3 at most (page, masterPage and a lightbox) which means that we are still at O(1)
		const pageStore =
			stores.find(({ store }) => store[id] || store[getFullId(id)]) ||
			(pageId && stores.find(({ store }) => store[pageId]))

		return pageStore ? pageStore.store : generalStore
	}

	const getContextIdOfCompId = (compId: string): string | null => {
		const pageStore = getPageStore(compId)
		if (pageStore === generalStore) {
			return null
		}
		const { id } = stores.find(({ store }) => store === pageStore)!
		return id
	}

	const subscribers: Subscribers<T> = []
	const update = <TSpecificData>(partialStore: TSpecificData) => {
		const partialStoreWithCompleteEntries = Object.entries(partialStore).reduce((acc, [compId, value]) => {
			const pageStore = getPageStore(compId, value?.pageId)
			pageStore[compId as keyof T] = { ...pageStore[compId], ...value }
			acc[compId] = pageStore[compId]
			return acc
		}, {} as { [key: string]: any }) as T

		subscribers.forEach((cb) => {
			cb(partialStoreWithCompleteEntries)
		})
	}

	const set = (partialStore: T) => {
		Object.entries(partialStore).forEach(([compId, value]) => {
			const pageStore = getPageStore(compId)
			pageStore[compId as keyof T] = { ...value }
		}, {} as T)

		subscribers.forEach((cb) => {
			cb(partialStore)
		})
	}
	const moveToPageStore = (id: string, pageId: string) => {
		delete getPageStore(id)[id]
		const newPageStore = getPageStore(id, pageId) as { [key: string]: any }
		newPageStore[id] = {}
	}
	// this method takes a comp id and currently operates in O(n).
	const updatePageId = (id: string, pageId?: string) => {
		if (pageId && pageId !== id) {
			const currentStore = getPageStore(id)
			moveToPageStore(id, pageId)
			// reparent repeated items with displayedIds inflated from 'id'
			const isRepeatedComponent = isRepeatedComponentOfTemplate(id)
			const repeatedItems = Object.keys(currentStore).filter(isRepeatedComponent) // O(n)
			repeatedItems.forEach((inflatedId) => moveToPageStore(inflatedId, pageId))
		}
	}
	return {
		updatePageId,
		get: (id: string) => {
			const pageStore = getPageStore(id)!
			return pageStore[id]
		},
		getContextIdOfCompId,
		setChildStore: (contextId: string, pageNewStore?: T) => {
			if (pageNewStore) {
				const otherPagesStores = stores.filter(({ id }) => id !== contextId)
				const storesItem = { id: contextId, store: { ...pageNewStore } }
				stores = [storesItem, ...otherPagesStores]

				// Apply changes made before adding the page to the store
				generalStore = Object.entries(generalStore).reduce((acc, [compId, value]) => {
					if (pageNewStore[compId] || pageNewStore[getFullId(compId)]) {
						storesItem.store[compId as keyof T] = { ...storesItem.store[compId], ...value }
					} else {
						acc[compId] = value
					}
					return acc
				}, {} as { [key: string]: any }) as T
			} else {
				const pageCurrentStore = stores.find(({ id }) => id === contextId)
				if (!pageCurrentStore) {
					return
				}
				stores = stores.filter(({ id }) => id !== contextId)
				const emptyStore = Object.keys(pageCurrentStore!.store).reduce((acc, compId) => {
					acc[compId] = null
					return acc
				}, {} as { [key: string]: null }) as T
				subscribers.forEach((cb) => cb(emptyStore))
			}
		},
		getEntireStore: () => Object.assign({}, ...[...stores].reverse().map(({ store }) => store), generalStore),
		update,
		set,
		subscribeToChanges: (cb: Subscriber<T>) => {
			subscribers.push(cb)
			return () => {
				const index = subscribers.indexOf(cb)
				if (index >= 0) {
					subscribers.splice(index, 1)
				}
			}
		},
	}
}
