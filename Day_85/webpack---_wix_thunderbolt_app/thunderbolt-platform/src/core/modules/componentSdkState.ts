import { CreateSdkState, SetSdkStateFn } from '@wix/thunderbolt-symbols'
import { COMPONENT_SDK_STATE } from './moduleNames'

type StateStore = {
	[compId: string]: {
		[namespace: string]: {
			[key: string]: unknown
		}
	}
}

export type IComponentSdkState = {
	createSdkState(compId: string): CreateSdkState
	clearStateByPredicate(predicate: (compId: string) => boolean): void
}

const ComponentSdkState = (): IComponentSdkState => {
	const stateStore: StateStore = {}

	return {
		createSdkState(compId) {
			return (initialState, namespace = 'comp') => {
				stateStore[compId] = stateStore[compId] || {}
				stateStore[compId][namespace] = stateStore[compId][namespace] || { ...initialState }

				const setState: SetSdkStateFn = (partialState) => {
					Object.assign(stateStore[compId][namespace], partialState)
				}

				const state = stateStore[compId][namespace]

				return [state as typeof initialState, setState]
			}
		},
		clearStateByPredicate(predicate) {
			Object.keys(stateStore).forEach((compId) => {
				if (predicate(compId)) {
					delete stateStore[compId]
				}
			})
		},
	}
}

export default {
	factory: ComponentSdkState,
	deps: [],
	name: COMPONENT_SDK_STATE,
}
