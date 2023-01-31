import { DashboardWixCodeSdkWixCodeApi } from '../..'
import { CallDashboardApi } from './callDashboardApiFactory'

// TODO: import from business-manager-api?
export const SHOW_TOAST = 'businessManager.showToast'
export const SHOW_BADGE = 'businessManager.showSidebarBadge'
export const NAVIGATE_TO = 'businessManager.navigateTo'
export const GET_CURRENT_INSTANCE = 'businessManager.getCurrentInstance'
export const GET_MANDATORY_BI_FIELDS = 'businessManager.getMandatoryBIFields'
export const VIEW_START_LOADING = 'businessManager.viewStartLoading'
export const VIEW_FINISHED_LOADING = 'businessManager.viewFinishedLoading'
export const VIEW_FIRST_INTERACTIVE = 'businessManager.viewFirstInteractive'

export const dashboardApiFacadeFactory = (callDashboardApi: CallDashboardApi): DashboardWixCodeSdkWixCodeApi => {
	const dashboardWixCodeSdkApi: DashboardWixCodeSdkWixCodeApi = {
		invoke(methodName: string, ...args: Array<any>) {
			return callDashboardApi('invoke', methodName, ...args)
		},

		notifyListeners(eventName: string, ...eventData: Array<any>) {
			return callDashboardApi('notifyListeners', eventName, ...eventData)
		},

		addListener(eventName: string, callback: (...eventData: Array<any>) => void) {
			return callDashboardApi('addListener', eventName, callback)
		},

		getModuleParams() {
			return callDashboardApi('getModuleParams')
		},

		openLightbox() {
			return callDashboardApi('openLightbox')
		},

		closeLightbox() {
			return callDashboardApi('closeLightbox')
		},

		showToast(toastConfig) {
			return dashboardWixCodeSdkApi.invoke(SHOW_TOAST, toastConfig)
		},

		showBadge(badge) {
			return dashboardWixCodeSdkApi.invoke(SHOW_BADGE, badge)
		},

		navigateTo(navigateToPageConfig) {
			return dashboardWixCodeSdkApi.invoke(NAVIGATE_TO, navigateToPageConfig)
		},

		getCurrentInstance(appDefId) {
			return dashboardWixCodeSdkApi.invoke(GET_CURRENT_INSTANCE, appDefId)
		},

		getMandatoryBIFields() {
			return dashboardWixCodeSdkApi.invoke(GET_MANDATORY_BI_FIELDS)
		},

		notifyViewStartLoading(subViewId) {
			return dashboardWixCodeSdkApi.notifyListeners(VIEW_START_LOADING, subViewId)
		},

		notifyViewFinishedLoading(subViewId) {
			return dashboardWixCodeSdkApi.notifyListeners(VIEW_FINISHED_LOADING, subViewId)
		},

		notifyViewFirstInteractive(subViewId) {
			return dashboardWixCodeSdkApi.notifyListeners(VIEW_FIRST_INTERACTIVE, subViewId)
		},
	}

	return dashboardWixCodeSdkApi
}
