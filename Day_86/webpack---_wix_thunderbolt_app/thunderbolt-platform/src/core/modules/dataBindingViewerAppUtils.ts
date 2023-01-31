import _ from 'lodash'
import type { ViewerAppSpecData } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { BOOTSTRAP_DATA, DATA_BINDING_VIEWER_APP_UTILS } from './moduleNames'

interface DataBindingViewerAppData {
	gridAppId: string
}

export interface IDataBindingViewerAppUtils {
	createAppData(appData: ViewerAppSpecData): DataBindingViewerAppData
}

const DataBindingViewerAppUtils = (bootstrapData: BootstrapData): IDataBindingViewerAppUtils => {
	const {
		wixCodeBootstrapData: { wixCodeModel },
	} = bootstrapData

	return {
		createAppData() {
			return {
				gridAppId: _.get(wixCodeModel, 'appData.codeAppId'),
			}
		},
	}
}

export default {
	factory: DataBindingViewerAppUtils,
	deps: [BOOTSTRAP_DATA],
	name: DATA_BINDING_VIEWER_APP_UTILS,
}
