import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { ILoadFeatures } from '@wix/thunderbolt-features'
import {
	FeatureExportsSymbol,
	FeatureName,
	ExportsStoreSymbol,
	IMaterializedSubStore,
	ExportsMap,
	MaterializedStoreSymbol,
	IMaterializedStore,
} from '@wix/thunderbolt-symbols'
import type { IFeatureExportsStore } from './types'

const featureExports = (featureName: FeatureName) => (exportStore: IMaterializedSubStore<ExportsMap>) => {
	return {
		export: (value: Record<string, any>) => {
			exportStore.update({ [featureName]: value })
		},
		get: (path: Array<string>) => exportStore.get([featureName, ...path]),
	}
}

export const FeatureExports = (featureName: FeatureName) =>
	withDependencies([ExportsStoreSymbol], featureExports(featureName))

export const ExportsStore = withDependencies([MaterializedStoreSymbol], (materializedStore: IMaterializedStore) =>
	materializedStore.createStore('exports')
)

export const site = ({
	specificEnvFeaturesLoaders,
}: {
	specificEnvFeaturesLoaders: ILoadFeatures
}): ContainerModuleLoader => (bind) => {
	bind(ExportsStoreSymbol).to(ExportsStore)
	specificEnvFeaturesLoaders
		.getAllFeatureNames()
		.forEach((featureName) =>
			bind(FeatureExportsSymbol).to(FeatureExports(featureName)).whenTargetNamed(featureName)
		)
}

export { IFeatureExportsStore }
