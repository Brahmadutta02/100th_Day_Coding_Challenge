import type { RouterConfig } from '@wix/thunderbolt-ssr-api'
import type { AppParams, PlatformEnvData, ViewerAppSpecData } from '@wix/thunderbolt-symbols'
import type { IBlocksAppsUtils } from '../modules/blocksAppsUtils'
import type { IWixCodeViewerAppUtils } from '../modules/wixCodeViewerAppUtils'
import type { IDataBindingViewerAppUtils } from '../modules/dataBindingViewerAppUtils'
import { BlocksPreviewAppDefId, WixCodeAppDefId, DataBindingAppDefId } from '../constants'

export function createAppParams({
	appSpecData,
	wixCodeViewerAppUtils,
	blocksAppsUtils,
	dataBindingViewerAppUtils,
	dynamicRouteData,
	routerConfigMap,
	appInstance,
	baseUrls,
	viewerScriptUrl,
	blocksData,
}: {
	appSpecData: ViewerAppSpecData
	wixCodeViewerAppUtils: IWixCodeViewerAppUtils
	blocksAppsUtils: IBlocksAppsUtils
	dataBindingViewerAppUtils: IDataBindingViewerAppUtils
	dynamicRouteData?: PlatformEnvData['router']['dynamicRouteData']
	routerConfigMap: Array<RouterConfig> | null
	appInstance: string
	baseUrls: Record<string, string> | null | undefined
	viewerScriptUrl: string
	blocksData: unknown
}): AppParams {
	const specificAppDataByApp: { [appDefId: string]: (appData: ViewerAppSpecData) => any } = {
		[WixCodeAppDefId]: wixCodeViewerAppUtils.createWixCodeAppData,
		[BlocksPreviewAppDefId]: blocksAppsUtils.createBlocksPreviewAppData,
		[DataBindingAppDefId]: dataBindingViewerAppUtils.createAppData,
	}

	const createSpecificAppData = () => {
		if (blocksAppsUtils.isBlocksApp(appSpecData)) {
			return blocksAppsUtils.createBlocksConsumerAppData(appSpecData)
		}

		return specificAppDataByApp[appSpecData.appDefinitionId]?.(appSpecData)
	}

	return {
		appInstanceId: appSpecData.appDefinitionId,
		appDefinitionId: appSpecData.appDefinitionId,
		appName: appSpecData.appDefinitionName || appSpecData.type || appSpecData.appDefinitionId,
		instanceId: appSpecData.instanceId,
		instance: appInstance,
		url: viewerScriptUrl,
		baseUrls,
		appData: createSpecificAppData(),
		appRouters: routerConfigMap,
		routerReturnedData: dynamicRouteData?.pageData, // TODO deprecate this in favor of wixWindow.getRouterData()
		blocksData,
	}
}
