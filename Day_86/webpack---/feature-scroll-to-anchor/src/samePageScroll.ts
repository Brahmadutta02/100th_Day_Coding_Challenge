import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	FeatureStateSymbol,
	IPageWillMountHandler,
	IPageWillUnmountHandler,
	PageFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { name, ScrollToAnchorHandlerProviderSymbol } from './symbols'
import type {
	ISamePageScroll,
	SamePageScrollState,
	ScrollToAnchorPageConfig,
	IScrollToAnchorHandlerProvider,
} from './types'
import type { IFeatureState } from 'thunderbolt-feature-state'
import _ from 'lodash'

export const samePageScrollFactory = (
	{ anchorDataIdToCompIdMap }: ScrollToAnchorPageConfig,
	featureState: IFeatureState<SamePageScrollState>,
	{ getHandler }: IScrollToAnchorHandlerProvider
): ISamePageScroll & IPageWillMountHandler & IPageWillUnmountHandler => {
	return {
		name: 'samePageScroll',
		pageWillMount() {
			// merge page and masterPage's pageConfigs so features using samePageScroll will be able to scroll to any anchor from any container
			featureState.update((state) => ({ ...state, ...anchorDataIdToCompIdMap }))
		},
		scrollToAnchor: getHandler(),
		pageWillUnmount() {
			// avoid hold onto anchors from dead pages
			featureState.update((state) => _.omit(state, Object.keys(anchorDataIdToCompIdMap)))
		},
	}
}

export const SamePageScroll = withDependencies(
	[named(PageFeatureConfigSymbol, name), named(FeatureStateSymbol, name), ScrollToAnchorHandlerProviderSymbol],
	samePageScrollFactory
)
