import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import type { PageTransitionsDidMountFactory } from './types'
import { name, PageTransitionsCompletedSymbol } from './symbols'

const pageTransitionsDidMountFactory: PageTransitionsDidMountFactory = (pageTransitionsCompleted, featureState) => {
	return {
		pageDidMount(pageId) {
			const state = featureState.get()

			if (state?.isFirstMount ?? true) {
				pageTransitionsCompleted.notifyPageTransitionsCompleted(pageId)
			}

			featureState.update((current) => ({
				...current,
				isFirstMount: false,
			}))
		},
		pageWillUnmount({ contextId }) {
			// release propStore subscription
			featureState.get()?.propsUpdateListenersUnsubscribers?.[contextId]?.()
			featureState.update((currentState) => {
				const propsUpdateListenersUnsubscribers = currentState?.propsUpdateListenersUnsubscribers ?? {}
				delete propsUpdateListenersUnsubscribers[contextId]
				return {
					...currentState,
					propsUpdateListenersUnsubscribers,
				}
			})
		},
	}
}

export const PageTransitionsDidMount = withDependencies(
	[PageTransitionsCompletedSymbol, named(FeatureStateSymbol, name)],
	pageTransitionsDidMountFactory
)
