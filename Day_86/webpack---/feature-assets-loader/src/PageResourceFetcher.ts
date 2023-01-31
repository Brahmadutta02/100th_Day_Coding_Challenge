import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	CurrentRouteInfoSymbol,
	IPageResourceFetcher,
	SiteAssetsClientSym,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'
import { errorPagesIds } from '@wix/thunderbolt-commons'
import { ICurrentRouteInfo } from 'feature-router'

export const resourceFetcher: (
	viewerModel: ViewerModel,
	siteAssetsClient: SiteAssetsClientAdapter,
	currentRouteInfo: ICurrentRouteInfo,
	browserWindow: BrowserWindow
) => IPageResourceFetcher = (viewerModel, siteAssetsClient, currentRouteInfo, browserWindow) => ({
	fetchResource(pageCompId, resourceType) {
		const {
			siteAssets: { modulesParams, siteScopeParams },
			mode: { siteAssetsFallback },
		} = viewerModel

		const moduleParams = modulesParams[resourceType]
		const isErrorPage = !!errorPagesIds[pageCompId]

		const pageJsonFileNames = siteScopeParams.pageJsonFileNames
		const pageJsonFileName =
			pageJsonFileNames[pageCompId] || currentRouteInfo.getCurrentRouteInfo()?.pageJsonFileName
		const extendedTimeout = viewerModel.experiments['specs.thunderbolt.shouldExtendSiteAssetsTimeout'] === 'true'
		const customRouting = viewerModel.experiments['specs.thunderbolt.siteAssetsCustomRouting'] as string
		const checkoutOOI =
			new URL(browserWindow?.location.href || viewerModel.requestUrl).searchParams.get('checkoutOOI') === 'true'

		return siteAssetsClient.execute(
			{
				moduleParams,
				pageCompId,
				...(pageJsonFileName ? { pageJsonFileName } : {}),
				...(isErrorPage
					? {
							pageCompId: isErrorPage ? 'masterPage' : pageCompId,
							errorPageId: pageCompId,
							pageJsonFileName: pageJsonFileNames.masterPage,
					  }
					: {}),
				extendedTimeout,
				customRouting,
				checkoutOOI,
			},
			siteAssetsFallback
		)
	},
	getResourceUrl(pageCompId, resourceType): string {
		const {
			siteAssets: { modulesParams, siteScopeParams },
		} = viewerModel

		const moduleParams = modulesParams[resourceType]
		const isErrorPage = !!errorPagesIds[pageCompId]

		const pageJsonFileNames = siteScopeParams.pageJsonFileNames
		const pageJsonFileName =
			pageJsonFileNames[pageCompId] || currentRouteInfo.getCurrentRouteInfo()?.pageJsonFileName
		const checkoutOOI =
			new URL(browserWindow?.location.href || viewerModel.requestUrl).searchParams.get('checkoutOOI') === 'true'

		return siteAssetsClient.calcPublicModuleUrl({
			moduleParams,
			pageCompId,
			...(pageJsonFileName ? { pageJsonFileName } : {}),
			...(isErrorPage
				? {
						pageCompId: isErrorPage ? 'masterPage' : pageCompId,
						errorPageId: pageCompId,
						pageJsonFileName: pageJsonFileNames.masterPage,
				  }
				: {}),
			checkoutOOI,
		})
	},
})

export const PageResourceFetcher = withDependencies<IPageResourceFetcher>(
	[ViewerModelSym, SiteAssetsClientSym, CurrentRouteInfoSymbol, BrowserWindowSymbol],
	resourceFetcher
)
