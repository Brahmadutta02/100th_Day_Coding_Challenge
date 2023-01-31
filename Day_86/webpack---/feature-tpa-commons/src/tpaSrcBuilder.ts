import { named, withDependencies, multi } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	SiteFeatureConfigSymbol,
	TpaCompData,
	TpaSrcQueryParamProviderSymbol,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import type {
	ITpaSrcBuilder,
	BuildTpaSrcOptions,
	TpaInnerRouteConfig,
	TpaCommonsSiteConfig,
	ITpaSrcQueryParamProvider,
} from './types'
import _ from 'lodash'
import { extractInnerRoute } from '@wix/thunderbolt-commons'

const appendInnerRoute = (parts: Array<string>, targetUrl: string, searchString: string) => {
	if (parts.length === 0) {
		return targetUrl
	}
	const innerRoute = parts.join('/')
	const addr = new URL(targetUrl)
	addr.pathname += `/${innerRoute}`
	if (searchString) {
		const searchParams = new URLSearchParams(searchString)
		searchParams.forEach((v, k) => addr.searchParams.append(k, v))
	}
	return addr.href
}

export const TpaSrcBuilder = withDependencies(
	[named(SiteFeatureConfigSymbol, name), BrowserWindowSymbol, multi(TpaSrcQueryParamProviderSymbol)],
	(
		{ widgetsClientSpecMapData, externalBaseUrl, requestUrl }: TpaCommonsSiteConfig,
		browserWindow: BrowserWindow,
		tpaSrcQueryParamsProviders: Array<ITpaSrcQueryParamProvider>
	): ITpaSrcBuilder => {
		return {
			buildSrc(
				id: string,
				pageId: string,
				tpaCompData: Partial<TpaCompData>,
				baseUrl: string,
				partialOptions: Partial<BuildTpaSrcOptions> = {}
			) {
				const widgetCSMData = widgetsClientSpecMapData[tpaCompData.widgetId!] || {}

				const withTpaInnerRoute = (tpaUrl: string, tpaInnerRouteConfig: TpaInnerRouteConfig) => {
					const hasTpaInnerRoute = Boolean(
						tpaInnerRouteConfig.tpaPageUri &&
							!_.isNil(widgetCSMData.applicationId) &&
							widgetCSMData.applicationId === tpaInnerRouteConfig.tpaApplicationId
					)

					const [rawPathname] = (browserWindow?.location.href || requestUrl)
						.replace(externalBaseUrl, '')
						.split('?')

					// rawPathname might contain encoded search string for the tpa section and need to be decoded and added to the tpa inner route
					const [pathName, searchString] = decodeURIComponent(rawPathname).split('?')

					const innerRouteParts =
						hasTpaInnerRoute && extractInnerRoute(pathName, tpaInnerRouteConfig.tpaPageUri)
					if (innerRouteParts && widgetCSMData.appPage?.defaultPage) {
						// TPAMultiSection with default page, need to add the default page to the inner route
						innerRouteParts.unshift(widgetCSMData.appPage!.defaultPage)
					}
					return innerRouteParts ? appendInnerRoute(innerRouteParts, tpaUrl, searchString) : tpaUrl
				}

				const defaultOptions: BuildTpaSrcOptions = {
					tpaInnerRouteConfig: null,
					extraQueryParams: {},
					appDefinitionId: '',
				}

				const options: BuildTpaSrcOptions = _.merge(defaultOptions, partialOptions)

				const queryParamProviderArg = {
					compId: id,
					pageId,
					tpaCompData,
					options,
				}

				const urlQueryParams: Record<string, string | undefined | null> = _.assign(
					{},
					...tpaSrcQueryParamsProviders.map((provider) => provider.getQueryParams(queryParamProviderArg))
				)

				const targetSrc = options.tpaInnerRouteConfig
					? withTpaInnerRoute(baseUrl, options.tpaInnerRouteConfig)
					: baseUrl

				let url: URL
				try {
					url = new URL(targetSrc)
				} catch (e) {
					return ''
				}

				_.entries(urlQueryParams).forEach(([key, value]) => {
					if (!_.isNil(value)) {
						url.searchParams.set(key, value)
					}
				})

				if (process.env.PACKAGE_NAME === 'thunderbolt-ds') {
					const deviceTypeForTPA = url.searchParams.get('deviceTypeForTPA')
					if (deviceTypeForTPA) {
						url.searchParams.set('deviceType', deviceTypeForTPA)
					}
				}

				return url.href
			},
		}
	}
)
