import _ from 'lodash'
import { BootstrapData } from '../../types'
import { APPS_URLS, BOOTSTRAP_DATA } from './moduleNames'

export type IAppsUrls = {
	getViewerScriptUrl(appDefinitionId: string): string | null
	getControllerScriptUrl(appDefinitionId: string, widgetId: string): string | null | undefined
	getBaseUrls(appDefinitionId: string): Record<string, string> | undefined | null
}

const AppsUrls = ({ appsUrlData }: BootstrapData): IAppsUrls => {
	return {
		getViewerScriptUrl(appDefinitionId: string) {
			const appData = appsUrlData[appDefinitionId]
			if (!appData) {
				return null
			}

			return appData.viewerScriptUrl
		},
		getControllerScriptUrl(appDefinitionId: string, widgetId: string) {
			const appData = appsUrlData[appDefinitionId]
			if (!appData || !appData.widgets) {
				return null
			}

			return _.get(appData.widgets[widgetId], 'controllerUrl')
		},
		getBaseUrls(appDefinitionId: string) {
			const appData = appsUrlData[appDefinitionId]
			if (!appData) {
				return null
			}

			return appData.baseUrls
		},
	}
}

export default {
	factory: AppsUrls,
	deps: [BOOTSTRAP_DATA],
	name: APPS_URLS,
}
