import { named, withDependencies } from '@wix/thunderbolt-ioc'
import _ from 'lodash'
import { name as tpaCommons, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import {
	ILogger,
	IPropsStore,
	LoggerSymbol,
	PageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { ITpaLoadMeasure, TpaPageConfig } from './types'
import { getFullId } from '@wix/thunderbolt-commons'
import { name } from './symbols'

export const TpaLoadMeasure = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommons), named(PageFeatureConfigSymbol, name), Props, LoggerSymbol],
	(
		{ widgetsClientSpecMapData }: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		props: IPropsStore,
		logger: ILogger
	): ITpaLoadMeasure => {
		const loadDurationTrackers: { [compId: string]: { src: string; reportLoadFinished: () => void } } = {}

		return {
			reportTpaLoadStart: (compId, newSrc) => {
				const { widgets } = tpaPageConfig
				const tpaCompData = widgets[compId] || widgets[getFullId(compId)]
				const { widgetId, appDefinitionId } = tpaCompData
				if (!widgetsClientSpecMapData[widgetId]) {
					// widget not in CSM, ignore it
					return
				}

				const shouldTrack =
					widgetsClientSpecMapData[widgetId].isWixTPA && newSrc && props.get(compId)?.src !== newSrc
				if (!shouldTrack) {
					// only track wix TPAs with valid src that has changed
					return
				}

				const TPA_LOAD_EVENT = 'tpa_iframe_load'
				const loadStart = Date.now()
				logger.interactionStarted(TPA_LOAD_EVENT, {
					customParams: {
						appDefinitionId,
						widgetId,
					},
				})
				loadDurationTrackers[compId] = {
					src: newSrc,
					reportLoadFinished: _.once(() =>
						logger.interactionEnded(TPA_LOAD_EVENT, {
							customParams: {
								appDefinitionId,
								widgetId,
								duration: Date.now() - loadStart,
							},
						})
					),
				}
			},
			reportTpaLoadEnd: (compId) => {
				const loadEndReporter = loadDurationTrackers[compId]
				if (loadEndReporter?.src && props.get(compId)?.src === loadEndReporter.src) {
					// dont report stale src
					loadEndReporter.reportLoadFinished()
				}
			},
		}
	}
)
