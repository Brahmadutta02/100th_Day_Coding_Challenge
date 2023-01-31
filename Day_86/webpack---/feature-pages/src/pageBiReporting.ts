import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	IAppDidMountHandler,
	ILogger,
	IStructureAPI,
	LoggerSymbol,
	Structure,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import { FeaturesLoaderSymbol, ILoadFeatures } from '@wix/thunderbolt-features'

export default withDependencies<IAppDidMountHandler>(
	[FeaturesLoaderSymbol, ViewerModelSym, LoggerSymbol, Structure],
	(featuresLoader: ILoadFeatures, viewerModel: ViewerModel, logger: ILogger, structureApi: IStructureAPI) => ({
		appDidMount: async () => {
			try {
				const features = [...featuresLoader.getLoadedPageFeatures(), ...viewerModel.siteFeatures]
				const components = Object.values(structureApi.getEntireStore()).map((item) => item.componentType)
				logger.meter(`page_features_loaded`, {
					customParams: {
						features,
						components,
					},
				})
			} catch {}
		},
	})
)
