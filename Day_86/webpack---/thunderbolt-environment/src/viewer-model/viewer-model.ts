import { ViewerModelSym, SiteFeatureConfigSymbol, ViewModeSym, LanguageSymbol } from '@wix/thunderbolt-symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'

export const site = ({ viewerModel }: Environment): ContainerModuleLoader => (bind) => {
	const { language, viewMode, ...restOfViewerModel } = viewerModel
	bind(ViewerModelSym).toConstantValue(restOfViewerModel)
	bind(LanguageSymbol).toConstantValue(language)
	bind(ViewModeSym).toConstantValue(viewMode)

	Object.entries(viewerModel.siteFeaturesConfigs).forEach(([featureName, featureConfig]) =>
		bind(SiteFeatureConfigSymbol).toConstantValue(featureConfig).whenTargetNamed(featureName)
	)
}
