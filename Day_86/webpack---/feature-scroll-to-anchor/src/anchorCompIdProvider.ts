import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { IAnchorCompIdProvider, SamePageScrollState } from './types'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'

const anchorCompIdProviderFactory = (featureState: IFeatureState<SamePageScrollState>): IAnchorCompIdProvider => {
	return {
		getAnchorCompId: (anchorDataId) => featureState.get()[anchorDataId],
	}
}

export const AnchorDataItCompIdProvider = withDependencies(
	[named(FeatureStateSymbol, name)],
	anchorCompIdProviderFactory
)
