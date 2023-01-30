import {
	IPropsStore,
	MasterPageFeatureConfigSymbol,
	PageFeatureConfigSymbol,
	Props,
	TpaHandlerProvider,
	ViewerModel,
	AppStyleProps,
	AppWidgetData,
} from '@wix/thunderbolt-symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { IOoiTpaSharedConfig, OoiTpaSharedConfigSymbol } from 'feature-ooi-tpa-shared-config'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { ITpaLoadMeasure, TpaMasterPageConfig, TpaPageConfig } from '../types'
import { name, TpaLoadMeasureSymbol } from '../symbols'

export type MessageData = { version: string }

export type AppIsAliveResponse = AppStyleProps &
	AppWidgetData & {
		fonts: { cssUrls: any; imageSpriteUrl: string; fontsMeta: any }
		commonConfig: ViewerModel['commonConfig']
		isVisualFocusEnabled: boolean
		siteColors: any
		siteTextPresets: any
	}

export const AppIsAliveHandler = withDependencies(
	[
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		TpaLoadMeasureSymbol,
		CommonConfigSymbol,
		Props,
		OoiTpaSharedConfigSymbol,
	],
	(
		tpaMasterPageConfig: TpaMasterPageConfig,
		{ widgets }: TpaPageConfig,
		tpaLoadMeasure: ITpaLoadMeasure,
		commonConfigAPI: ICommonConfig,
		props: IPropsStore,
		{ getFontsConfig }: IOoiTpaSharedConfig
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				appIsAlive(compId: string, msgData, { originCompId }): AppIsAliveResponse {
					const { siteColors, isVisualFocusEnabled, siteTextPresets } = tpaMasterPageConfig
					props.update({
						[compId]: {
							sentAppIsAlive: true,
						},
					})
					tpaLoadMeasure.reportTpaLoadEnd(compId)
					const widgetData = widgets[originCompId] || {
						style: {
							colors: {},
							numbers: {},
							booleans: {},
							fonts: {},
							googleFontsCssUrl: '',
							uploadFontFaces: '',
						},
					}

					return {
						fonts: getFontsConfig(),
						commonConfig: commonConfigAPI.getCommonConfig(),
						isVisualFocusEnabled,
						siteColors,
						siteTextPresets,
						...widgetData,
					}
				},
			}
		},
	})
)
