import { withDependencies } from '@wix/thunderbolt-ioc'
import { PageStyleLoaderSymbol } from './symbols'
import { ILoadPageStyle } from './PageStyleLoader'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPageAssetsLoader,
	IPageResourceFetcher,
	PageAssets,
	PageResourceFetcherSymbol,
	SiteAssetsResources,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const createPageAssetsExtractor = (pageFeatures: Promise<SiteAssetsResources['features']>) => <
	K extends keyof PageAssets
>(
	extractor: (result: ThenArg<SiteAssetsResources['features']>) => ThenArg<PageAssets[K]>
) => pageFeatures.then((result) => extractor(result))

const pageAssetsLoaderImplFactory: (
	pageResourceFetcher: IPageResourceFetcher,
	pageStyleLoader: ILoadPageStyle,
	browserWindow: BrowserWindow,
	viewerModel: ViewerModel
) => IPageAssetsLoader = (pageResourceFetcher, pageStyleLoader, browserWindow, viewerModel) => {
	const assetsCache: Record<string, PageAssets> = {}

	const createPageAssets = (pageCompId: string): PageAssets => {
		const addCssPromise = pageStyleLoader.load(pageCompId)
		const pageFeatures = pageResourceFetcher.fetchResource(pageCompId, 'features')

		const extractByPageAssetType = createPageAssetsExtractor(pageFeatures)
		return {
			components: extractByPageAssetType<'components'>(({ structure: { components } }) => components),
			features: extractByPageAssetType<'features'>(({ structure: { features } }) => features),
			siteFeaturesConfigs: extractByPageAssetType<'siteFeaturesConfigs'>(
				({ structure: { siteFeaturesConfigs } }) => siteFeaturesConfigs
			),
			props: extractByPageAssetType<'props'>(({ props }) => props),
			stateRefs: extractByPageAssetType<'stateRefs'>(({ stateRefs }) => stateRefs),
			css: addCssPromise,
		}
	}

	return {
		load: (pageCompId: string) => {
			const checkoutOOI =
				new URL(browserWindow?.location.href || viewerModel.requestUrl).searchParams.get('checkoutOOI') ===
				'true'
			const cacheKey = checkoutOOI ? `${pageCompId}-checkoutOOI` : pageCompId
			assetsCache[cacheKey] = assetsCache[cacheKey] || createPageAssets(pageCompId)
			return assetsCache[cacheKey]
		},
	}
}

export const PageAssetsLoaderImpl = withDependencies(
	[PageResourceFetcherSymbol, PageStyleLoaderSymbol, BrowserWindowSymbol, ViewerModelSym],
	pageAssetsLoaderImplFactory
)
