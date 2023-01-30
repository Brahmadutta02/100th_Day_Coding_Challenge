import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol, IPropsStore, Props } from '@wix/thunderbolt-symbols'
import type { PageTransitionsPageState } from './types'
import { name, PageTransitionsCompletedSymbol } from './symbols'
import { ComponentWillMount, ViewerComponent } from 'feature-components'
import type { IFeatureState } from 'thunderbolt-feature-state'
import type { IPageTransitionsCompleted } from './IPageTransitionsCompleted'
import { ScrollRestorationAPISymbol, IScrollRestorationAPI } from 'feature-scroll-restoration'

export const PageComponentTransitionsWillMount = withDependencies(
	[Props, PageTransitionsCompletedSymbol, ScrollRestorationAPISymbol, named(FeatureStateSymbol, name)],
	(
		propsStore: IPropsStore,
		pageTransitionsCompleted: IPageTransitionsCompleted,
		scrollRestorationAPI: IScrollRestorationAPI,
		featureState: IFeatureState<PageTransitionsPageState>
	): ComponentWillMount<ViewerComponent> => {
		return {
			componentTypes: ['Page'],
			componentWillMount(pageComponent) {
				const state = featureState.get()
				const transitionEnabled = state ? state.nextTransitionEnabled : true
				const isFirstMount = state ? state.isFirstMount : true

				const pageId = pageComponent.id

				propsStore.update({
					SITE_PAGES: {
						transitionEnabled,
						onTransitionStarting: () => {
							if (!scrollRestorationAPI.getScrollYHistoryState()) {
								scrollRestorationAPI.scrollToTop()
							}
						},
						onTransitionComplete: () => {
							pageTransitionsCompleted.notifyPageTransitionsCompleted(pageId)
							if (scrollRestorationAPI.getScrollYHistoryState()) {
								scrollRestorationAPI.restoreScrollPosition()
							}
						},
					},
				})

				featureState.update(() => ({
					...state,
					isFirstMount,
					nextTransitionEnabled: true,
				}))
			},
		}
	}
)
