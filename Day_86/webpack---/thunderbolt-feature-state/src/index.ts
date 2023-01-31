import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { ILoadFeatures } from '@wix/thunderbolt-features'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import type { IFeatureState } from './types'

const featureState = <T>(): IFeatureState<T> => {
	let state: T
	return {
		get: () => state,
		update: (reducer) => {
			state = reducer(state)
		},
	}
}

export const FeatureState = withDependencies([], featureState)

export const site = ({
	specificEnvFeaturesLoaders,
}: {
	specificEnvFeaturesLoaders: ILoadFeatures
}): ContainerModuleLoader => (bind) => {
	specificEnvFeaturesLoaders
		.getAllFeatureNames()
		.forEach((featureName) => bind(FeatureStateSymbol).to(FeatureState).whenTargetNamed(featureName))
}

export { IFeatureState }
