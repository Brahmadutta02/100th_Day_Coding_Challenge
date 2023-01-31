import type { BatchingStrategy, StoreNoUpdate, ILayoutDoneService } from '@wix/thunderbolt-symbols'
import type { StoreWithSubscribe } from '../types'

type Subscriber = (partialStore: Record<string, any>) => void
type Subscribers = Array<Subscriber>
type SomeCollection = Record<string, any>

export function extendStoreWithSubscribe<StoreType extends StoreNoUpdate<SomeCollection>>(
	store: StoreType,
	batchingStrategy: BatchingStrategy,
	layoutDoneService?: ILayoutDoneService
): StoreWithSubscribe<StoreType> {
	const subscribers: Record<string, Subscribers> = {}
	const unSubscribers: Record<string, Subscribers> = {}
	const ANY_COMP = 'Any Comp'

	const setRenderPendingIfNeeded = (partialStore: SomeCollection) => {
		if (!layoutDoneService || layoutDoneService.isRenderPending()) {
			return
		}

		const componentsSubscribedForChange = Object.keys(partialStore).filter((compId) => subscribers[compId])
		if (componentsSubscribedForChange.length > 0) {
			layoutDoneService.setRenderPending(true, componentsSubscribedForChange)
		}
	}

	const trigger = (compId: string, compProps: Record<string, any>, handlers: Record<string, Subscribers>) =>
		handlers[compId] &&
		[...handlers[compId]].forEach((cb) => {
			cb(compProps)
		})

	function notifyComponents(partialStore: SomeCollection) {
		const updates: SomeCollection = {}
		Object.entries(partialStore).forEach(([compId, compProps]) => {
			if (compProps) {
				updates[compId] = compProps
			} else {
				trigger(compId, compProps, unSubscribers)
			}
		})

		setRenderPendingIfNeeded(updates)

		batchingStrategy.batch(() => {
			Object.entries(updates).forEach(([compId, compProps]) => trigger(compId, compProps, subscribers))
			subscribers[ANY_COMP]?.forEach((cb) => cb(partialStore))
		})
	}

	store.subscribeToChanges((partial: SomeCollection) => notifyComponents(partial))

	const subscribeById = (id: string, cb: Subscriber) => {
		const cleanup = (compId: string, callback: Subscriber, subscriberCollection: Record<string, Subscribers>) => {
			if (!subscriberCollection[compId]) {
				return
			}
			const index = subscriberCollection[compId].indexOf(callback)
			if (index >= 0) {
				subscriberCollection[compId].splice(index, 1)
			}
			if (subscriberCollection[compId].length === 0) {
				delete subscriberCollection[compId]
			}
		}

		const unSubscribe = () => {
			cleanup(id, cb, subscribers)
			cleanup(id, unSubscribe, unSubscribers)
		}

		subscribers[id] = subscribers[id] || []
		unSubscribers[id] = unSubscribers[id] || []
		subscribers[id].push(cb)
		unSubscribers[id].push(unSubscribe)

		return unSubscribe
	}

	return {
		...store,
		subscribeById,
		subscribeToChanges: (callback) => subscribeById(ANY_COMP, callback),
	}
}
