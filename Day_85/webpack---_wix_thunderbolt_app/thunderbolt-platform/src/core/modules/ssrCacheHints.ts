import _ from 'lodash'
import type { Initializable, IModelsAPI } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { BOOTSTRAP_DATA, MODELS_API, SSR_CACHE_HINTS, VIEWER_HANDLERS } from './moduleNames'

const SsrCacheHints = ({ platformEnvData }: BootstrapData, modelsApi: IModelsAPI, { viewerHandlers }: IViewerHandlers): Initializable => ({
	init: () => {
		if (!process.env.browser && platformEnvData.bi.pageData.pageNumber === 1) {
			const platformControllersOnPage = _.mapValues(modelsApi.getApplications(), (controllers) => _(controllers).mapKeys('controllerType').keys().value())
			viewerHandlers.ssr.setSsrCacheHints({ platformControllersOnPage })
		}
	},
})

export default {
	factory: SsrCacheHints,
	deps: [BOOTSTRAP_DATA, MODELS_API, VIEWER_HANDLERS],
	name: SSR_CACHE_HINTS,
}
