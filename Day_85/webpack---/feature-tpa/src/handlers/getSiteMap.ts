import _ from 'lodash'
import { SiteMapSymbol } from '../symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ISiteMap, SitePagesResponse } from '../types'

export const GetSiteMapHandler = withDependencies(
	[SiteMapSymbol],
	({ getSiteMap }: ISiteMap): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async getSitePages(
					compId: string,
					{ includePagesUrl }: { includePagesUrl: boolean }
				): Promise<SitePagesResponse> {
					const items = await getSiteMap()
					return items.map((item) => ({
						hide: item.hidden,
						id: _.isString(item.pageId) && item.pageId.replace('#', ''),
						isHomepage: item.isHomePage || false,
						title: item.title,
						...(includePagesUrl && { url: item.url }),
					}))
				},
				getSiteMap,
			}
		},
	})
)
