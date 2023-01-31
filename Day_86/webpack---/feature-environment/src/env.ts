import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	IAppWillMountHandler,
	FeatureExportsSymbol,
	ReducedMotionSymbol,
	ViewerModelSym,
	ViewerModel,
	Experiments,
	ExperimentsSymbol,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { name } from './symbols'
import { EnvSiteConfig } from './types'

const exportsName = 'env'

export const EnvFactory = withDependencies(
	[
		named(FeatureExportsSymbol, name),
		ReducedMotionSymbol,
		ViewerModelSym,
		ExperimentsSymbol,
		named(SiteFeatureConfigSymbol, name),
	],
	(
		envExports: IFeatureExportsStore<typeof exportsName>,
		reducedMotion: boolean,
		viewerModel: ViewerModel,
		experiments: Experiments,
		siteFeatureConfig: EnvSiteConfig
	): IAppWillMountHandler => {
		return {
			appWillMount() {
				envExports.export({
					reducedMotion,
					userId: viewerModel.site.userId,
					experiments,
					editorType: siteFeatureConfig.editorType,
					domain: siteFeatureConfig.domain,
					previewMode: siteFeatureConfig.previewMode,
				})
			},
		}
	}
)
