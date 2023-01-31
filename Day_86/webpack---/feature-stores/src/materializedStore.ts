import {
	Subscriber,
	IMaterializedStore,
	IMaterializedSubStore,
	StoreWithUpdate,
	AppMaterializerSymbol,
} from '@wix/thunderbolt-symbols'
import { getDisplayedId, getFullId, getItemId } from '@wix/thunderbolt-commons'
import { createMaterializer, Materializer } from '@wix/materializer'
import { withDependencies } from '@wix/thunderbolt-ioc'

type Subscribers<T> = Array<Subscriber<T>>

export const getMaterializedStore = (materializer: Materializer): IMaterializedStore => {
	const observedRoots: Array<string> = []
	const subscribers: Subscribers<any> = []

	return {
		createContextBasedStore: <T extends Record<string, any>>(subStoreName: string): StoreWithUpdate<T> => {
			observedRoots.push(subStoreName)
			const getPageStoreName = (id: string, pageId?: string) => {
				const subStore = materializer.get([subStoreName]) || {}
				const storeNames = Object.keys(subStore)
				return (
					storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][id]) ||
					storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][getFullId(id)]) ||
					(pageId &&
						storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][pageId])) ||
					'general'
				)
			}

			const getContextIdOfCompId = (compId: string): string | null => {
				const pageStore = getPageStoreName(compId)
				return pageStore === 'general' ? null : pageStore
			}

			const update = <TSpecificData>(partialStore: TSpecificData) => {
				const invalidations = materializer.batch((materializerUpdate) => {
					for (const compId in partialStore) {
						const pageStore = getPageStoreName(compId)
						materializerUpdate(subStoreName, pageStore, compId, partialStore[compId])
					}
				})

				const updates = Object.assign(
					{},
					...invalidations.map((path) => {
						const [, , compId] = path
						return { [compId]: materializer.get(path) }
					})
				)

				subscribers.forEach((cb) => {
					cb(updates)
				})
			}

			const moveToPageStore = (id: string, pageId: string) => {
				const currentStoreName = getPageStoreName(id, pageId)
				materializer.update(subStoreName, currentStoreName, id, undefined)
				const newStoreName = getPageStoreName(id, pageId)
				materializer.update(subStoreName, newStoreName, id, {})
			}

			const updatePageId = (id: string, pageId?: string) => {
				if (pageId && pageId !== id) {
					const currentStoreName = getPageStoreName(id)
					const currentStore = materializer.get([subStoreName, currentStoreName])

					if (!currentStore) {
						return
					}

					moveToPageStore(id, pageId)

					// repeater items with displayedIds inflated from 'id'
					const repeatersItems = Object.keys(currentStore).filter(
						(compId) => getDisplayedId(id, getItemId(compId)) === compId
					)
					repeatersItems.forEach((inflatedId) => moveToPageStore(inflatedId, pageId))
				}
			}

			return {
				get: (id: string) => {
					const pageStore = getPageStoreName(id)!
					return materializer.get([subStoreName, pageStore, id])
				},
				getContextIdOfCompId,
				setChildStore: (contextId: string, pageNewStore?: T) => {
					if (pageNewStore) {
						const generalStore = materializer.get([subStoreName, 'general'])

						const payload = Object.keys(generalStore || {}).reduce<Record<string, Record<string, any>>>(
							(acc, compId) => {
								if (pageNewStore[compId] || pageNewStore[getFullId(compId)]) {
									acc[contextId][compId] = { ...pageNewStore[compId], ...generalStore[compId] }
									acc.general[compId] = undefined
								}
								return acc
							},
							{ general: {}, [contextId]: {} }
						)

						const contextStore = { ...pageNewStore, ...payload[contextId] }
						materializer.batch((materializerUpdate) => {
							for (const generalKey in payload.general) {
								materializerUpdate(subStoreName, 'general', generalKey, payload.general[generalKey])
							}

							for (const contextKey in contextStore) {
								materializerUpdate(subStoreName, contextId, contextKey, contextStore[contextKey])
							}
						})
					} else {
						const invalidations = materializer.update(subStoreName, contextId, undefined)
						const emptyStore = Object.assign(
							{},
							...invalidations.map(([, , compId]) => ({ [compId]: null }))
						)
						subscribers.forEach((cb) => cb(emptyStore))
					}
				},
				getEntireStore: () => {
					const { general, ...otherStores } = materializer.get(subStoreName)
					return Object.assign({}, general, ...Object.values(otherStores))
				},
				update,
				updatePageId,
				set: () => {
					throw new Error('Unsupported')
				},
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
		},
		createStore: <T extends Record<string, any>>(subStoreName: string): IMaterializedSubStore<T> => {
			return {
				update: (partialStore: Partial<T>) => {
					const invalidations = materializer.batch((materializerUpdate) => {
						for (const key2 in partialStore) {
							for (const key3 in partialStore[key2]) {
								materializerUpdate(subStoreName, key2, key3, partialStore[key2][key3])
							}
						}
					})
					const updates = Object.assign(
						{},
						...invalidations.map((path) => {
							const [, , compId] = path
							return { [compId]: materializer.get(path) }
						})
					)

					subscribers.forEach((cb) => {
						cb(updates)
					})
				},
				get: (path: Array<string>) => {
					return materializer.get([subStoreName, ...path])
				},
			}
		},
	}
}

export const MaterializedStore = withDependencies([AppMaterializerSymbol], getMaterializedStore)
export const AppMaterializer = withDependencies([], createMaterializer)
