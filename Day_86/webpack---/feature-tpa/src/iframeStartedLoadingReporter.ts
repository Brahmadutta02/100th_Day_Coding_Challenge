import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BusinessLogger,
	BusinessLoggerSymbol,
	CurrentRouteInfoSymbol,
	PageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	WixBiSession,
	WixBiSessionSymbol,
} from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo, IPageNumber, PageNumberSymbol } from 'feature-router'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { name } from './symbols'
import type { TpaPageConfig, IIFrameStartedLoadingReporter } from './types'
import { getFullId } from '@wix/thunderbolt-commons'

export const IFrameStartedLoadingReporter = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		CurrentRouteInfoSymbol,
		WixBiSessionSymbol,
		BusinessLoggerSymbol,
		PageNumberSymbol,
	],
	(
		{ widgetsClientSpecMapData }: TpaCommonsSiteConfig,
		{ widgets }: TpaPageConfig,
		currentRouteInfo: ICurrentRouteInfo,
		wixBiSession: WixBiSession,
		businessLogger: BusinessLogger,
		pageNumberHandler: IPageNumber
	): IIFrameStartedLoadingReporter => ({
		reportIframeStartedLoading(compId) {
			const { widgetId, templateId } = widgets[compId] || widgets[getFullId(compId)]
			const routeInfo = currentRouteInfo.getCurrentRouteInfo()
			const tts = Math.round(performance.now())
			businessLogger.logger.log(
				{
					appId: widgetsClientSpecMapData[widgetId].appDefinitionId,
					widget_id: widgetId,
					instance_id: templateId ?? compId,
					src: 42,
					// APP_IFRAME_START_LOADING
					evid: 642,
					tts,
					pid: routeInfo ? routeInfo.pageId : null,
					pn: pageNumberHandler.getPageNumber(),
				},
				{ endpoint: 'ugc-viewer' }
			)
		},
	})
)
