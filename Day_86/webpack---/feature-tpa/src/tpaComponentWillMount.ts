import _ from 'lodash'
import { getFullId } from '@wix/thunderbolt-commons'
import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import type { ComponentWillMount, ViewerComponent } from 'feature-components'
import { ILogger, LoggerSymbol, PageFeatureConfigSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import {
	ITpaSection,
	MasterPageTpaPropsCache,
	MasterPageTpaPropsCacheSymbol,
	TpaCommonsSiteConfig,
	TpaSectionRegistry,
	TpaSectionSymbol,
	name as tpaCommons,
	TpaDataCapsuleSymbol,
	ITpaDataCapsule,
} from 'feature-tpa-commons'
import * as ResponsiveChatUtils from './utils/responsiveChatUtils'
import type { IIFrameStartedLoadingReporter, ITpaComponentApi, ITpaLoadMeasure, TpaPageConfig } from './types'
import { TPA_COMPONENTS } from './constants'
import { IFrameStartedLoadingReporterSymbol, name, TpaComponentApiSymbol, TpaLoadMeasureSymbol } from './symbols'

export const TpaComponentWillMount = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommons),
		named(PageFeatureConfigSymbol, name),
		TpaLoadMeasureSymbol,
		TpaComponentApiSymbol,
		TpaSectionSymbol,
		MasterPageTpaPropsCacheSymbol,
		LoggerSymbol,
		optional(IFrameStartedLoadingReporterSymbol),
		optional(TpaDataCapsuleSymbol),
	],
	(
		{ widgetsClientSpecMapData }: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		tpaLoadMeasure: ITpaLoadMeasure,
		tpaComponentApi: ITpaComponentApi,
		{ registerTpaSection, unregisterTpaSection }: ITpaSection,
		propsCache: MasterPageTpaPropsCache,
		logger: ILogger,
		iframeStartedLoadingReporter?: IIFrameStartedLoadingReporter,
		dataCapsule?: ITpaDataCapsule
	): ComponentWillMount<ViewerComponent<any>> => {
		const reportTpaDataError = ({
			appDefinitionId = 'UNKNOWN',
			widgetId = 'UNKNOWN',
			compId,
			reason,
		}: {
			appDefinitionId?: string
			widgetId?: string
			compId: string
			reason: string
		}) => {
			const errorName = 'IframeTpaDataIntegrityError'
			const error = new Error(errorName)
			error.name = errorName
			logger.captureError(error, {
				tags: {
					appDefinitionId,
					widgetId,
					feature: 'tpa',
					methodName: 'componentWillMount',
					reason,
				},
				extra: {
					compId,
				},
			})
		}

		return {
			componentTypes: TPA_COMPONENTS,
			componentWillMount(comp) {
				const { widgets, tpaInnerRouteConfig, pageId } = tpaPageConfig
				const tpaCompData = widgets[comp.id] || widgets[getFullId(comp.id)]
				if (!tpaCompData) {
					reportTpaDataError({ compId: comp.id, reason: 'MISSING_DATA_ITEM' })
					return
				}
				const { widgetId, isSection, appDefinitionId, templateId } = tpaCompData
				if (!widgetsClientSpecMapData[widgetId]) {
					// widget not in CSM, ignore it
					reportTpaDataError({ appDefinitionId, widgetId, compId: comp.id, reason: 'MISSING_FROM_CSM' })
					return
				}
				if (dataCapsule) {
					dataCapsule.registerToDataCapsule(templateId || comp.id, appDefinitionId)
				}

				const buildSrc = () =>
					tpaComponentApi.buildSrc({
						compId: comp.id,
						tpaCompData,
						pageId,
						tpaInnerRouteConfig,
					})

				if (isSection) {
					// provide cross containers api for tpa sections
					const entry: TpaSectionRegistry = {
						appDefinitionId,
						rebuildSrc: () => {
							const updatedSrc = buildSrc()
							tpaLoadMeasure.reportTpaLoadStart(comp.id, updatedSrc)
							comp.updateProps({
								src: updatedSrc,
							})
						},
					}
					registerTpaSection(comp.id, entry)
				}

				const reportIframeStartedLoading = _.once(() => {
					if (iframeStartedLoadingReporter) {
						iframeStartedLoadingReporter.reportIframeStartedLoading(comp.id)
					}
				})

				const src = buildSrc()

				const reportWidgetUnresponsive = _.once(() => {
					const { appDefinitionName, isWixTPA } = widgetsClientSpecMapData[widgetId]
					if (isWixTPA) {
						const error = new Error('TPA did not send appIsAlive')
						error.name = 'IframeTpaUnresponsive'
						logger.captureError(error, {
							tags: {
								appDefinitionId,
								widgetId,
								invalidSrc: !src,
								feature: 'tpa',
								methodName: 'componentWillMount',
							},
							extra: {
								appDefinitionName,
								src,
							},
						})
					}
				})

				const defaultProps = tpaComponentApi.getDefaultProps(
					widgetId,
					reportIframeStartedLoading,
					reportWidgetUnresponsive
				)

				// Get cached props by template/uniqueId depending on if the comp is a responsive chat
				const templateOrUniqueId = ResponsiveChatUtils.getTemplateOrUniqueId(comp.id, tpaCompData)
				const cachedProps = propsCache ? propsCache.getCachedProps(templateOrUniqueId) : {}

				tpaLoadMeasure.reportTpaLoadStart(comp.id, src)
				comp.updateProps({
					...defaultProps,
					src,
					...(cachedProps as any),
				})

				return () => {
					if (propsCache) {
						if (pageId === 'masterPage') {
							propsCache.cacheProps(comp.id)
						} else if (ResponsiveChatUtils.isResponsiveChat(tpaCompData)) {
							// For chat to persist between navigations when isResponsive is true - we are caching its props
							// Even if its not in the master page

							// Cache the already given props, by the viewer id, and save them under the template
							propsCache.cacheProps(templateOrUniqueId, comp.getProps())
						}
					}

					unregisterTpaSection(comp.id)
					if (dataCapsule) {
						dataCapsule.unregister(templateId || comp.id)
					}
				}
			},
		}
	}
)
