import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { PageFeatureConfigSymbol, SiteFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { name } from '../symbols'
import { TpaPageConfig } from '../types'

export type GetComponentInfoResponse = {
	compId: string
	showOnAllPages: boolean
	pageId: string
	tpaWidgetId?: string
	appPageId?: string
}

export const GetComponentInfoHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName), named(PageFeatureConfigSymbol, name)],
	({ widgetsClientSpecMapData }: TpaCommonsSiteConfig, { pageId }: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getComponentInfo(compId, msgData, { tpaCompData: { widgetId = '' } = {} }): GetComponentInfoResponse {
					const showOnAllPages = pageId === 'masterPage'
					return {
						compId,
						showOnAllPages,
						pageId: showOnAllPages ? '' : pageId,
						tpaWidgetId: widgetsClientSpecMapData[widgetId]?.tpaWidgetId,
						appPageId: widgetsClientSpecMapData[widgetId]?.appPage?.id || '',
					}
				},
			}
		},
	})
)
