import { IPlatformLogger, SiteAssetsResourceType } from '@wix/thunderbolt-symbols'
import { MasterPageId } from './core/constants'
import type { BootstrapData } from './types'
import { errorPagesIds } from '@wix/thunderbolt-commons'
import type { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'

export function fetchModelsFactory({ logger, bootstrapData, siteAssetsClient }: { logger: IPlatformLogger; bootstrapData: BootstrapData; siteAssetsClient: SiteAssetsClientAdapter }) {
	return function fetchModel<T>(resourceType: SiteAssetsResourceType, isMasterPage: boolean): Promise<T> {
		return logger.runAsyncAndReport(`getModel_${resourceType}${isMasterPage ? `_${MasterPageId}` : ''}`, () => {
			const pageCompId = isMasterPage ? MasterPageId : `${bootstrapData.currentPageId}`
			const isErrorPage = !!errorPagesIds[pageCompId]
			const errorPageData = isErrorPage ? { pageCompId: isErrorPage ? 'masterPage' : pageCompId, errorPageId: pageCompId } : {}
			const {
				modulesParams,
				siteScopeParams,
				clientInitParams: { fallbackStrategy },
			} = bootstrapData.platformEnvData.siteAssets
			const pageJsonFileNames = siteScopeParams.pageJsonFileNames
			const pageJsonFileName = isMasterPage || isErrorPage ? pageJsonFileNames[MasterPageId] : pageJsonFileNames[pageCompId]
			// TODO - handle/catch site-assets client error
			logger.captureBreadcrumb({
				message: 'fetchModel',
				category: 'model',
				data: {
					moduleParams: modulesParams[resourceType],
					pageCompId,
					isErrorPage,
					errorPageData,
					pageJsonFileName,
					pageJsonFileNames,
					isMasterPage,
					'bootstrapData-pageJsonFileName': bootstrapData.platformEnvData.router.pageJsonFileName,
				},
			})
			const extendedTimeout = bootstrapData.platformEnvData.site.experiments['specs.thunderbolt.shouldExtendSiteAssetsTimeout'] === 'true'
			const customRouting = bootstrapData.platformEnvData.site.experiments['specs.thunderbolt.siteAssetsCustomRouting'] as string
			const checkoutOOI = new URL(bootstrapData.platformEnvData.location.rawUrl).searchParams.get('checkoutOOI') === 'true'

			return siteAssetsClient.execute(
				{
					moduleParams: modulesParams[resourceType],
					pageCompId,
					...errorPageData,
					pageJsonFileName: pageJsonFileName || bootstrapData.platformEnvData.router.pageJsonFileName,
					extendedTimeout,
					customRouting,
					checkoutOOI,
				},
				fallbackStrategy
			)
		})
	}
}
