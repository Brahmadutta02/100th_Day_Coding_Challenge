import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider, DynamicPagesSymbol } from '@wix/thunderbolt-symbols'
import { DynamicPagesAPI } from 'feature-router'
import { SiteWixCodeSdkHandlers } from '../types'

export const siteSdkProvider = withDependencies(
	[optional(DynamicPagesSymbol)],
	(dynamicPagesAPI: DynamicPagesAPI): SdkHandlersProvider<SiteWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			getSitemapFetchParams: (routePrefix) => {
				if (!dynamicPagesAPI) {
					return null
				}

				return dynamicPagesAPI.getSitemapFetchParams(routePrefix)
			},
		}),
	})
)
