import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { IPageDidMountHandler, FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import type { WixEmbedsAPIFeatureState } from './types'

const wixEmbedsApiFactory = (featureState: IFeatureState<WixEmbedsAPIFeatureState>): IPageDidMountHandler => {
	return {
		async pageDidMount(pageId) {
			const state = featureState.get()
			if (state.firstMount) {
				// First mount is considered "initial load" and not "navigation" for this API's purpose
				// so we do not dispatch a "navigation" event
				state.firstMount = false
				return
			}
			const eventData = { id: pageId }
			const listeners = state.listeners.pageNavigation || []
			listeners.forEach((cb) => cb(eventData))
		},
	}
}

export const WixEmbedsApiPageNavigation = withDependencies([named(FeatureStateSymbol, name)], wixEmbedsApiFactory)
