import { withDependencies } from '@wix/thunderbolt-ioc'
import { Experiments, ExperimentsSymbol, PlatformEnvDataProvider, SiteAssetsClientSym, ViewerModel, ViewerModelSym } from '@wix/thunderbolt-symbols'
import { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'

export const siteAssetsEnvDataProvider = withDependencies(
	[ExperimentsSymbol, SiteAssetsClientSym, ViewerModelSym],
	(experiments: Experiments, siteAssetsClient: SiteAssetsClientAdapter, viewerModel: ViewerModel): PlatformEnvDataProvider => {
		const {
			siteAssets,
			deviceInfo,
			mode: { siteAssetsFallback },
		} = viewerModel
		const clientInitParams = {
			deviceInfo,
			siteAssetsClientConfig: siteAssetsClient.getInitConfig(),
			fallbackStrategy: siteAssetsFallback,
		}

		return {
			platformEnvData: {
				siteAssets: {
					...siteAssets,
					clientInitParams,
				},
			},
		}
	}
)
