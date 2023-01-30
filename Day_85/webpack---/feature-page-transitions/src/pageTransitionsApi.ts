import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import type { PageTransitionsApiFactory } from './types'
import { name } from './symbols'

const pageTransitionsApiFactory: PageTransitionsApiFactory = (featureState) => {
	return {
		disableNextTransition: () =>
			featureState.update((current) => ({
				...current,
				nextTransitionEnabled: false,
			})),
	}
}

export const PageTransitionsApi = withDependencies([named(FeatureStateSymbol, name)], pageTransitionsApiFactory)
