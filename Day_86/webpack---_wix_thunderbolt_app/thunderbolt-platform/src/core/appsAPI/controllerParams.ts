import _ from 'lodash'
import type { ViewerPlatformEssentials, AppEssentials } from '@wix/fe-essentials-viewer-platform'
import type { Connections, ControllerDataAPI, AppParams, WixCodeApi, PlatformAPI, PlatformServicesAPI, LivePreviewOptions, WidgetsClientSpecMapData } from '@wix/thunderbolt-symbols'
import type { IWixSelector } from '../modules/wixSelector'
import type { CreateSetPropsForOOI } from '../modules/setPropsManager'
import type { ISlotsManager } from '../modules/slotsManager'
import type { ControllerData } from '../types'
import type { PlatformApiProvider } from '../modules/platformApiProvider'

export function createControllersParams(
	createSetPropsForOOI: CreateSetPropsForOOI,
	controllersData: Array<ControllerData>,
	connections: Connections,
	wixSelector: IWixSelector,
	slotsManager: ISlotsManager,
	widgetsClientSpecMapData: WidgetsClientSpecMapData,
	appParams: AppParams,
	wixCodeApi: WixCodeApi,
	platformAppServicesApi: PlatformServicesAPI,
	platformApi: PlatformAPI,
	csrfToken: string,
	essentials: ViewerPlatformEssentials,
	appEssentials: AppEssentials,
	platformApiProvider: PlatformApiProvider,
	livePreviewOptions?: Partial<LivePreviewOptions>
): Array<{ controllerCompId: string; controllerParams: ControllerDataAPI }> {
	return controllersData.map((controllerData) => {
		const { controllerType, compId, templateId, config, externalId, context } = controllerData
		const $wScope = context
			? wixSelector.create$wRepeaterScope({
					compId: context._internal.repeaterCompId,
					itemId: context.itemId,
			  })
			: wixSelector.create$wGlobalScope()

		const clientSpecMapData = widgetsClientSpecMapData[controllerType]

		return {
			controllerCompId: compId,
			controllerParams: {
				$w: context ? wixSelector.create$w(compId).at(context) : wixSelector.create$w(compId),
				getSlot: (slotName) => slotsManager.getSlot(compId, compId, slotName, wixSelector.getInstance, $wScope),
				compId: templateId || compId,
				name: clientSpecMapData?.widgetName || controllerType,
				componentFields: clientSpecMapData?.componentFields || {},
				type: controllerType,
				config,
				connections: _.flatMap(connections[compId], _.values),
				warmupData: null,
				appParams,
				platformAPIs: Object.assign(platformApi, platformAppServicesApi),
				wixCodeApi,
				csrfToken,
				setProps: createSetPropsForOOI(compId, context),
				externalId,
				essentials: essentials.createControllerEssentials(
					{
						widgetId: controllerType,
						compId,
					},
					appEssentials
				),
				livePreviewOptions,
				platformApiProvider,
			},
		}
	})
}
