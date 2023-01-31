import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	BusinessLogger,
	BusinessLoggerSymbol,
	CurrentRouteInfoSymbol,
	SiteFeatureConfigSymbol,
	TpaHandlerProvider,
	WixBiSession,
	WixBiSessionSymbol,
} from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { ICurrentRouteInfo, IPageNumber, PageNumberSymbol } from 'feature-router'

export type MessageData = { stageNum: number; stage: string }
export type HandlerResponse = void

export const ApplicationLoadingStepHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		WixBiSessionSymbol,
		CurrentRouteInfoSymbol,
		optional(PageNumberSymbol),
		optional(BusinessLoggerSymbol),
	],
	(
		{ debug }: TpaCommonsSiteConfig,
		wixBiSession: WixBiSession,
		currentRouteInfo: ICurrentRouteInfo,
		pageNumberHandler?: IPageNumber,
		businessLogger?: BusinessLogger
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				applicationLoadingStep(
					compId,
					msgData: MessageData,
					{ appDefinitionId, tpaCompData: { widgetId } = {} }
				): HandlerResponse {
					if (runtimeTpaCompIdBuilder.isRuntimeCompId(compId)) {
						if (debug) {
							console.warn(`applicationLoadingStep is ignored in runtime component ${compId}`)
						}
						return
					}

					const routeInfo = currentRouteInfo.getCurrentRouteInfo()
					const tts = Math.round(performance.now())
					const { stage, stageNum } = msgData
					businessLogger?.logger.log(
						{
							appId: appDefinitionId,
							widget_id: widgetId,
							instance_id: compId,
							src: 42,
							// APP_LOADED_PARTIALLY
							evid: 644,
							tts,
							pid: routeInfo ? routeInfo.pageId : null,
							stage,
							stageNum,
							pn: pageNumberHandler!.getPageNumber(),
						},
						{ endpoint: 'ugc-viewer' }
					)
				},
			}
		},
	})
)
