import _ from 'lodash'
import { logSdkError } from '@wix/thunderbolt-commons'
import type { ClientSpecMapAPI } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { CLIENT_SPEC_MAP_API, BOOTSTRAP_DATA } from './moduleNames'

export const DATA_BINDING_APP_DEF_ID = 'dataBinding'
export const BLOCKS_PREVIEW_APP_DEF_ID = '46b2ad43-5720-41d2-8436-2058979cb53f'

const ClientSpecMapApi = (bootstrapData: BootstrapData): ClientSpecMapAPI => {
	const { appsSpecData, wixCodeBootstrapData, appsUrlData, blocksBootstrapData, widgetsClientSpecMapData } = bootstrapData
	const wixCodeAppData = wixCodeBootstrapData.wixCodeAppDefinitionId && appsSpecData[wixCodeBootstrapData.wixCodeAppDefinitionId]

	return {
		getViewerScriptUrl(appDefinitionId) {
			return _.get(appsUrlData, [appDefinitionId, 'viewerScriptUrl'])
		},
		getControllerScript(appDefinitionId, widgetId) {
			return _.get(appsUrlData, [appDefinitionId, 'widgets', widgetId, 'controllerUrl'])
		},
		getAppSpecData(appDefinitionId) {
			return appsSpecData[appDefinitionId]
		},
		getWidgetsClientSpecMapData(appDefinitionId) {
			return widgetsClientSpecMapData[appDefinitionId] || {}
		},
		isWixCodeInstalled() {
			return !!wixCodeAppData
		},
		getWixCodeAppDefinitionId() {
			return wixCodeBootstrapData.wixCodeAppDefinitionId
		},
		getWixCodeBaseUrl() {
			return wixCodeBootstrapData.elementorySupport.baseUrl
		},
		getDataBindingAppDefinitionId() {
			return DATA_BINDING_APP_DEF_ID
		},
		getBlocksPreviewAppDefinitionId() {
			return BLOCKS_PREVIEW_APP_DEF_ID
		},
		getBlocksAppsAppDefinitionIds() {
			return _.keys(blocksBootstrapData.blocksAppsData)
		},
		getBlocksData(appDefinitionId) {
			return blocksBootstrapData.blocksAppsData[appDefinitionId]
		},
		isAppOnSite(appDefinitionId) {
			return !!appsSpecData[appDefinitionId]
		},
		getAppsOnSite() {
			return _.keys(appsSpecData)
		},
		isWixTPA(appDefinitionId) {
			if (!appsSpecData[appDefinitionId]) {
				logSdkError(`App with appDefinitionId ${appDefinitionId} does not exist on the site`)
				return false
			}
			return !!appsSpecData[appDefinitionId].isWixTPA
		},
		isModuleFederated(appDefinitionId) {
			return !!appsSpecData[appDefinitionId].isModuleFederated
		},
	}
}

export default {
	factory: ClientSpecMapApi,
	deps: [BOOTSTRAP_DATA],
	name: CLIENT_SPEC_MAP_API,
}
