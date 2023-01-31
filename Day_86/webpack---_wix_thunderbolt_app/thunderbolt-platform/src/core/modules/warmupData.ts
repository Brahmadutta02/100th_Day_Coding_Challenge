import _ from 'lodash'
import { IWarmupData } from '@wix/thunderbolt-symbols'
import { AppsWarmupData } from 'feature-window-wix-code-sdk'
import { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { BOOTSTRAP_DATA, VIEWER_HANDLERS, WARMUP_DATA } from './moduleNames'

const WarmupData = ({ viewerHandlers }: IViewerHandlers, bootstrapData: BootstrapData): IWarmupData => {
	const {
		window: { isSSR },
		bi: {
			pageData: { pageNumber },
		},
	} = bootstrapData.platformEnvData

	// Init empty appsWarmupData and reassign it when the data is available, to avoid awaiting it.
	let appsWarmupData: AppsWarmupData = {}
	if (!isSSR && pageNumber === 1) {
		viewerHandlers.onAppsWarmupDataReady((warmupData: AppsWarmupData) => {
			appsWarmupData = warmupData
		})
	}

	return {
		getAppData(appDefinitionId, key) {
			if (isSSR) {
				console.warn('getting warmup data is not supported on the backend')
				return null
			}
			return _.get(appsWarmupData, [appDefinitionId, key])
		},
		setAppData(appDefinitionId, key, data) {
			if (!isSSR) {
				console.warn('setting warmup data is not supported in the browser')
				return
			}
			viewerHandlers.setAppWarmupData({ appDefinitionId, key, data })
		},
	}
}

export default {
	factory: WarmupData,
	deps: [VIEWER_HANDLERS, BOOTSTRAP_DATA],
	name: WARMUP_DATA,
}
