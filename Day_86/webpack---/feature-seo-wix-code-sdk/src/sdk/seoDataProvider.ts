import { withDependencies } from '@wix/thunderbolt-ioc'
import { ISeoSiteApi, SeoSiteSymbol } from 'feature-seo'
import { PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'

export const seoPlatformEnvDataProvider = withDependencies(
	[SeoSiteSymbol],
	(seoApi: ISeoSiteApi): PlatformEnvDataProvider => {
		const siteLevelSeoData = seoApi.getSiteLevelSeoData()
		return {
			platformEnvData: {
				seo: {
					...siteLevelSeoData,
				},
			},
		}
	}
)
